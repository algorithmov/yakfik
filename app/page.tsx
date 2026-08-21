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
  'Shawarma options?',
  'Cheapest burger',
  'Active deals',
  'Fastest pizza',
  'Best shawarma deal — order it',
];

const APP_STYLE: Record<string, { color: string; label: string }> = {
  talabat: { color: '#e8400c', label: '🍔 Talabat' },
  snoonu:  { color: '#dc2626', label: '🐾 Snoonu'  },
};

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
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setThinking(true);
    setLiveLog([]);

    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.text }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

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
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              role: 'assistant',
              text: data.text,
              toolLogs: data.toolLogs,
            }]);
          } else if (event === 'error') {
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              role: 'assistant',
              text: `Something went wrong: ${data.message}`,
            }]);
          }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      }]);
    } finally {
      setThinking(false);
      setLiveLog([]);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  return (
    <div style={{
      background: 'var(--bg)',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    }}>
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', width: '100%', maxWidth: 680,
      margin: '0 auto',
      background: 'var(--bg)',
    }}>

      {/* ── Header ── */}
      <header style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>🐱</span>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em',
            color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ color: 'var(--accent)' }}>Yakfik</span>
            <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 15 }}>· يكفيك</span>
          </div>
          <div style={{
            fontSize: 12, color: 'var(--muted)', marginTop: 1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            Compares Talabat &amp; Snoonu · finds the best deal · orders for you
          </div>
        </div>
      </header>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '24px 16px 8px',
        display: 'flex', flexDirection: 'column', gap: 14,
        background: 'var(--bg)',
      }}>

        {/* Empty state */}
        {messages.length === 0 && !thinking && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flex: 1, textAlign: 'center', padding: '0 24px',
          }}>
            <div style={{ fontSize: 56, marginBottom: 12, lineHeight: 1 }}>🐱</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>
              Hey, I&apos;m Yakfik!
            </div>
            <p style={{
              fontSize: 14, color: 'var(--muted)', lineHeight: 1.7,
              maxWidth: 340, marginBottom: 28,
            }}>
              Tell me what you want to eat. I&apos;ll check both Talabat and Snoonu,
              find the best deal, and order it for you.
            </p>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 8, justifyContent: 'center', maxWidth: 420,
            }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    padding: '7px 15px',
                    fontSize: 13,
                    color: 'var(--text)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 5,
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '11px 15px',
              borderRadius: msg.role === 'user'
                ? '18px 18px 4px 18px'
                : '4px 18px 18px 18px',
              background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              color: msg.role === 'user' ? '#fff' : 'var(--text)',
              fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap',
            }}>
              {msg.text}
            </div>

            {/* Tool call trace */}
            {msg.toolLogs && msg.toolLogs.length > 0 && (
              <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {msg.toolLogs.map((log, idx) => {
                  const app = APP_STYLE[log.app] ?? { color: '#888', label: log.app };
                  return (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 11, color: 'var(--muted)',
                      padding: '3px 10px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                    }}>
                      <span style={{ color: app.color, fontWeight: 600 }}>{app.label}</span>
                      <span style={{ opacity: 0.5 }}>›</span>
                      <span>{log.tool.replace(/_/g, ' ')}</span>
                      {log.args.query != null && (
                        <span style={{ opacity: 0.5, fontStyle: 'italic' }}>
                          &ldquo;{String(log.args.query)}&rdquo;
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {thinking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
            <div style={{
              padding: '11px 15px',
              borderRadius: '4px 18px 18px 18px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>🐱</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Checking apps…</span>
              <span style={{ display: 'flex', gap: 3, marginLeft: 2 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: 'var(--accent)', display: 'inline-block',
                    animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </span>
            </div>

            {liveLog.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingLeft: 4 }}>
                {liveLog.map((log, idx) => {
                  const app = APP_STYLE[log.app] ?? { color: '#888', label: log.app };
                  return (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 11, color: 'var(--muted)',
                      padding: '3px 10px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      animation: 'fadeIn 0.25s ease',
                    }}>
                      <span style={{ color: app.color, fontWeight: 600 }}>{app.label}</span>
                      <span style={{ opacity: 0.5 }}>›</span>
                      <span>{log.tool.replace(/_/g, ' ')}</span>
                      {log.args.query != null && (
                        <span style={{ opacity: 0.5, fontStyle: 'italic' }}>
                          &ldquo;{String(log.args.query)}&rdquo;
                        </span>
                      )}
                      <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: 10 }}>✓</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div style={{
        padding: '12px 16px 16px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        flexShrink: 0,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to eat?"
          disabled={thinking}
          style={{
            flex: 1, padding: '11px 16px',
            borderRadius: 999,
            border: '1.5px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)', fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.15s',
            opacity: thinking ? 0.5 : 1,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={thinking || !input.trim()}
          aria-label="Send"
          style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: thinking || !input.trim() ? 'var(--border)' : 'var(--accent)',
            border: 'none', color: '#fff', fontSize: 17,
            cursor: thinking || !input.trim() ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
        >
          ↑
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
    </div>
  );
}
