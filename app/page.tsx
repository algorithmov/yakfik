'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  toolLogs?: ToolLog[];
};

type ToolLog = {
  app: string;
  tool: string;
  args: Record<string, unknown>;
  result: string;
};

const SUGGESTIONS = [
  'What shawarma options are available?',
  'Find me the cheapest burger',
  'What deals are on right now?',
  'Get me the fastest pizza delivery',
  'Compare prices for shawarma and order the best one',
];

export default function YakfikPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [liveLog, setLiveLog] = useState<ToolLog[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  async function sendMessage(text: string) {
    if (!text.trim() || thinking) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);
    setLiveLog([]);

    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.text,
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const logs: ToolLog[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const eventMatch = part.match(/^event: (\w+)/);
          const dataMatch = part.match(/\ndata: (.+)$/s);
          if (!eventMatch || !dataMatch) continue;

          const event = eventMatch[1];
          const data = JSON.parse(dataMatch[1]);

          if (event === 'tool_log') {
            logs.push(data as ToolLog);
            setLiveLog([...logs]);
          } else if (event === 'answer') {
            const assistantMsg: Message = {
              id: crypto.randomUUID(),
              role: 'assistant',
              text: data.text,
              toolLogs: data.toolLogs,
            };
            setMessages((prev) => [...prev, assistantMsg]);
          } else if (event === 'error') {
            const errorMsg: Message = {
              id: crypto.randomUUID(),
              role: 'assistant',
              text: `Something went wrong: ${data.message}`,
            };
            setMessages((prev) => [...prev, errorMsg]);
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: `Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      ]);
    } finally {
      setThinking(false);
      setLiveLog([]);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const appStyle: Record<string, { color: string; emoji: string }> = {
    talabat: { color: '#e8400c', emoji: '🍔' },
    snoonu: { color: '#dc2626', emoji: '🐾' },
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      maxWidth: 720,
      margin: '0 auto',
    }}>
      <header style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 36 }}>🏜️</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--text)', letterSpacing: '-0.03em' }}>يكفيك · Yakfik</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 1 }}>
            Compares Talabat &amp; Snoonu · finds the best deal · orders for you
          </div>
        </div>
      </header>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {messages.length === 0 && !thinking && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🐱</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>
              Hey, I&apos;m Yakfik!
            </div>
            <div style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6 }}>
              Tell me what you want to eat and I&apos;ll check both Talabat and Snoonu to find you the best deal — then order it.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 13,
                    color: 'var(--text)',
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 6,
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
              background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              color: msg.role === 'user' ? '#fff' : 'var(--text)',
              fontSize: 15,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.text}
            </div>

            {msg.toolLogs && msg.toolLogs.length > 0 && (
              <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {msg.toolLogs.map((log, idx) => {
                  const app = appStyle[log.app] ?? { color: '#666', emoji: '🔧' };
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: 'var(--muted)',
                      padding: '4px 10px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                    }}>
                      <span style={{ color: app.color, fontWeight: 700 }}>{app.emoji} {log.app}</span>
                      <span style={{ opacity: 0.6 }}>›</span>
                      <span>{log.tool}</span>
                      {log.args.query != null && <span style={{ opacity: 0.6 }}>"{String(log.args.query)}"</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {thinking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '4px 18px 18px 18px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>🐱</span>
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>Checking apps…</span>
              <span style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'inline-block',
                    animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </span>
            </div>
            {liveLog.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {liveLog.map((log, idx) => {
                  const app = appStyle[log.app] ?? { color: '#666', emoji: '🔧' };
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: 'var(--muted)',
                      padding: '4px 10px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                    }}>
                      <span style={{ color: app.color, fontWeight: 700 }}>{app.emoji} {log.app}</span>
                      <span style={{ opacity: 0.6 }}>›</span>
                      <span>{log.tool}</span>
                      {log.args.query != null && <span style={{ opacity: 0.6 }}>"{String(log.args.query)}"</span>}
                      <span style={{ marginLeft: 'auto', color: '#22c55e', fontSize: 11 }}>✓</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        flexShrink: 0,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to eat?"
          disabled={thinking}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 999,
            border: '1.5px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontSize: 15,
            outline: 'none',
            opacity: thinking ? 0.5 : 1,
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={thinking || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: thinking || !input.trim() ? 'var(--border)' : 'var(--accent)',
            border: 'none',
            color: '#fff',
            fontSize: 18,
            cursor: thinking || !input.trim() ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-label="Send"
        >
          ↑
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
