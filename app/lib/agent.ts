import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export type ToolLog = {
  app: string;
  tool: string;
  args: Record<string, unknown>;
  result: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
  tool_call_id?: string;
  name?: string;
};

type OpenAITool = {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

type McpToolEntry = {
  appLabel: string;
  toolName: string; // prefixed: "talabat__search_menu"
  mcpUrl: string;
  originalName: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

async function fetchMcpTools(appLabel: string, mcpUrl: string): Promise<McpToolEntry[]> {
  const client = new Client({ name: 'yakfik', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(mcpUrl));
  await client.connect(transport);
  const { tools } = await client.listTools();
  await client.close();

  return tools.map((t) => ({
    appLabel,
    toolName: `${appLabel}__${t.name}`,
    mcpUrl,
    originalName: t.name,
    description: `[${appLabel.toUpperCase()}] ${t.description ?? t.name}`,
    inputSchema: (t.inputSchema as Record<string, unknown>) ?? { type: 'object', properties: {} },
  }));
}

async function callMcpTool(
  mcpUrl: string,
  toolName: string,
  args: Record<string, unknown>,
): Promise<string> {
  const client = new Client({ name: 'yakfik', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(mcpUrl));
  await client.connect(transport);
  const result = await client.callTool({ name: toolName, arguments: args });
  await client.close();

  const text = (result.content as Array<{ type: string; text?: string }>)
    .filter((c) => c.type === 'text')
    .map((c) => c.text ?? '')
    .join('\n');
  return text;
}

export async function runAgentLoop(
  messages: ChatMessage[],
  onToolLog: (log: ToolLog) => void,
): Promise<string> {
  const talabatUrl = process.env.TALABAT_MCP_URL;
  const snoonuUrl = process.env.SNOONU_MCP_URL;

  if (!talabatUrl || !snoonuUrl) {
    throw new Error('TALABAT_MCP_URL and SNOONU_MCP_URL must be set');
  }

  // Fetch tool lists from both MCP servers in parallel
  const [talabatTools, snoonuTools] = await Promise.all([
    fetchMcpTools('talabat', talabatUrl),
    fetchMcpTools('snoonu', snoonuUrl),
  ]);

  const allTools = [...talabatTools, ...snoonuTools];
  const toolMap = new Map(allTools.map((t) => [t.toolName, t]));

  // Convert to OpenAI tools schema
  const openAiTools: OpenAITool[] = allTools.map((t) => ({
    type: 'function',
    function: {
      name: t.toolName,
      description: t.description,
      parameters: t.inputSchema,
    },
  }));

  // System prompt
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `You are Yakfik (يكفيك), an AI assistant that helps users find the best food delivery deals in Qatar by comparing Talabat and Snoonu. 

You have access to tools for both apps. When a user asks about food, prices, or deals:
1. Search both apps using search_menu tools to compare options
2. Check deals with get_deals tools
3. Recommend the best option based on price, eta, and active deals
4. If asked to order, use place_order on the better app

Tool naming convention: tools prefixed with "talabat__" belong to Talabat, "snoonu__" belong to Snoonu.
For place_order, use session_id "demo-session" if the user didn't provide one.

Be concise and friendly. Always mention which app has the better deal and why.`,
  };

  const loopMessages: ChatMessage[] = [systemMessage, ...messages];
  const model = process.env.OPENROUTER_MODEL ?? 'moonshotai/kimi-k2:6';

  // Agent loop — max 10 iterations to prevent runaway loops
  for (let i = 0; i < 10; i++) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yakfik.vercel.app',
        'X-Title': 'Yakfik',
      },
      body: JSON.stringify({
        model,
        messages: loopMessages,
        tools: openAiTools,
        tool_choice: 'auto',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    if (!choice) throw new Error('No choices returned from OpenRouter');

    const assistantMsg = choice.message;

    // Add assistant turn to message history
    loopMessages.push({
      role: 'assistant',
      content: assistantMsg.content ?? '',
      ...(assistantMsg.tool_calls ? { tool_calls: assistantMsg.tool_calls } as any : {}),
    });

    // If no tool calls — we're done, return the text
    if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
      return assistantMsg.content ?? '';
    }

    // Execute each tool call
    for (const toolCall of assistantMsg.tool_calls) {
      const toolEntry = toolMap.get(toolCall.function.name);
      if (!toolEntry) {
        loopMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          content: `Error: unknown tool "${toolCall.function.name}"`,
        });
        continue;
      }

      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(toolCall.function.arguments ?? '{}');
      } catch {
        // leave args empty
      }

      const result = await callMcpTool(toolEntry.mcpUrl, toolEntry.originalName, args);

      onToolLog({ app: toolEntry.appLabel, tool: toolEntry.originalName, args, result });

      loopMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        name: toolCall.function.name,
        content: result,
      });
    }
  }

  throw new Error('Agent loop exceeded maximum iterations');
}
