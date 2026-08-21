import { runAgentLoop, type ChatMessage, type ToolLog } from '../../lib/agent';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  const messages: ChatMessage[] = body.messages ?? [];

  if (!messages.length) {
    return Response.json({ error: 'messages is required' }, { status: 400 });
  }

  // Stream response using ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      function send(event: string, data: unknown) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const toolLogs: ToolLog[] = [];

        const answer = await runAgentLoop(messages, (log) => {
          toolLogs.push(log);
          send('tool_log', log);
        });

        send('answer', { text: answer, toolLogs });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        send('error', { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
