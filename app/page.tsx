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
  talabat: { color: '#e8400c', label: 'Talabat' },
  snoonu:  { color: '#d81b60', label: 'Snoonu' },
};

const generateId = () => Math.random().toString(36).substring(2, 10);

export default function YakfikPage() {
  const [screen, setScreen] = useState<'home' | 'chat' | 'profile'>('home');
  const [activeTab, setActiveTab] = useState('home');

  const navigate = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') setScreen('home');
    else if (tab === 'profile') setScreen('profile');
    else if (tab === 'search') setScreen('chat');
    // 'saved' stays on current screen for now
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', width: '100%', maxWidth: 500, margin: '0 auto', position: 'relative', paddingBottom: 80 }}>
      
      {/* Screens */}
      {screen === 'home' && <HomeScreen onNavigate={() => setScreen('chat')} />}
      {screen === 'chat' && <ChatScreen onBack={() => setScreen('home')} />}
      {screen === 'profile' && <ProfileScreen />}

      {/* Global Bottom Navigation */}
      <BottomNav activeTab={activeTab} onNavigate={navigate} />
    </div>
  );
}

/* ── HOME SCREEN ── */
function HomeScreen({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="/brands/yakfik-logo.svg" alt="Yak Fik" style={{ width: 70, height: 'auto', flexShrink: 0 }} />
        <div style={{ background: '#eef1ef', borderRadius: 999, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
          📍 Doha, QA <span style={{ fontSize: 10, color: 'var(--muted)' }}>⌄</span>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f26d24', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>C</div>
      </div>

      {/* Hero */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 16 }}>
          <img src="/brands/mascot-smile.svg" alt="Cat" style={{ width: 80, height: 'auto' }} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 8, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Find the best deal.<br /><span style={{ color: 'var(--accent)' }}>Automatically.</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6 }}>
          Tell Yakfik what you're craving and we'll compare your options across all delivery apps.
        </p>
      </div>

      {/* Trending */}
      <div style={{ padding: '0 20px 24px' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>Trending Now</h3>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
          {[
            { emoji: '🔥', title: 'Shawarma Platter', sub: '~35 QAR avg.' },
            { emoji: '☕', title: 'Karak & Paratha', sub: '~15 QAR avg.' },
            { emoji: '🌿', title: 'Vegan Bowls', sub: '~45 QAR avg.' }
          ].map((item, index) => (
            <div key={index} onClick={onNavigate} style={{ minWidth: 140, background: 'var(--surface)', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: 'var(--surface)', borderRadius: 999, padding: '8px 8px 8px 18px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 18, marginRight: 12, color: 'var(--muted)' }}>🎤</span>
          <input placeholder="fries & drink under 30 QAR..." style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--text)', fontFamily: 'inherit' }} />
          <button onClick={onNavigate} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', color: 'white', border: 'none', fontSize: 18, cursor: 'pointer' }}>→</button>
        </div>
      </div>
    </div>
  );
}

/* ── CHAT SCREEN ── */
function ChatScreen({ onBack }: { onBack: () => void }) {
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
    const userMsg: Message = { id: generateId(), role: 'user', text };
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
            setMessages(prev => [...prev, { id: generateId(), role: 'assistant', text: data.text, toolLogs: data.toolLogs }]);
          } else if (event === 'error') {
            setMessages(prev => [...prev, { id: generateId(), role: 'assistant', text: `Something went wrong: ${data.message}` }]);
          }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', text: `Error: ${err instanceof Error ? err.message : 'Unknown error'}` }]);
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
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <img src="/brands/yakfik-logo.svg" alt="Yak Fik" style={{ width: 70, height: 'auto' }} />
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <img src="/brands/mascot-wink.svg" alt="Home" style={{ width: 36, height: 'auto' }} />
          </button>
        </div>

        {/* Messages */}
        {messages.length === 0 && !thinking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', padding: '0 24px' }}>
            <img src="/brands/mascot-smile.svg" alt="" style={{ width: 100, marginBottom: 16 }} />
            <div style={{ fontWeight: 700, fontSize: 21, color: 'var(--text)', marginBottom: 8 }}>Hey, I&apos;m Yakfik!</div>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 340, marginBottom: 28 }}>
              Tell me what you want to eat. I&apos;ll check both Talabat and Snoonu, find the best deal, and order it for you.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 420 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 999, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 6 }}>
            <div style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, maxWidth: '85%' }}>
              {msg.role === 'assistant' && <img src="/brands/mascot-chat.svg" alt="" style={{ width: 26, height: 'auto', flexShrink: 0, marginBottom: 4 }} />}
              <div style={{ padding: '11px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px', background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface)', border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none', color: msg.role === 'user' ? '#fff' : 'var(--text)', fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>
            </div>
            {msg.toolLogs && msg.toolLogs.length > 0 && (
              <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 4, marginLeft: msg.role === 'assistant' ? 34 : 0 }}>
                {msg.toolLogs.map((log, idx) => {
                  const app = APP_STYLE[log.app] ?? { color: 'var(--muted)', label: log.app };
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)', padding: '4px 11px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 999 }}>
                      <span style={{ color: app.color, fontWeight: 600 }}>{app.label}</span>
                      <span style={{ opacity: 0.4 }}>›</span>
                      <span>{log.tool.replace(/_/g, ' ')}</span>
                      {log.args.query != null && <span style={{ opacity: 0.6, fontStyle: 'italic' }}>&ldquo;{String(log.args.query)}&rdquo;</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {thinking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <img src="/brands/mascot-thinking.svg" alt="" style={{ width: 26, height: 'auto', marginBottom: 4, animation: 'pulse-soft 1.4s ease-in-out infinite' }} />
              <div style={{ padding: '11px 16px', borderRadius: '4px 18px 18px 18px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Checking apps…</span>
                <span style={{ display: 'flex', gap: 3 }}>
                  {[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />)}
                </span>
              </div>
            </div>
            {liveLog.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 34 }}>
                {liveLog.map((log, idx) => {
                  const app = APP_STYLE[log.app] ?? { color: 'var(--muted)', label: log.app };
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)', padding: '4px 11px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 999, animation: 'fadeIn 0.25s ease' }}>
                      <span style={{ color: app.color, fontWeight: 600 }}>{app.label}</span>
                      <span style={{ opacity: 0.4 }}>›</span>
                      <span>{log.tool.replace(/_/g, ' ')}</span>
                      {log.args.query != null && <span style={{ opacity: 0.6, fontStyle: 'italic' }}>&ldquo;{String(log.args.query)}&rdquo;</span>}
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

      {/* Input Bar */}
      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask anything…" disabled={thinking} style={{ flex: 1, padding: '12px 18px', borderRadius: 999, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, outline: 'none', opacity: thinking ? 0.5 : 1 }} />
        <button onClick={() => sendMessage(input)} disabled={thinking || !input.trim()} style={{ width: 44, height: 44, borderRadius: '50%', background: thinking || !input.trim() ? 'var(--border-strong)' : 'var(--accent)', border: 'none', color: '#fff', fontSize: 18, cursor: thinking || !input.trim() ? 'default' : 'pointer' }}>↑</button>
      </div>
    </>
  );
}

/* ── PROFILE SCREEN (Matches the image exactly) ── */
function ProfileScreen() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f26d24', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>C</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>Chaikh</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>📍 Doha, Qatar</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '0 16px 24px', display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: 'var(--accent-light)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>1</div>
          <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginTop: 4 }}>Saved</div>
        </div>
        <div style={{ flex: 1, background: 'var(--accent-light)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>14</div>
          <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginTop: 4 }}>Searches</div>
        </div>
        <div style={{ flex: 1, background: 'var(--accent-light)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>47 QAR</div>
          <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginTop: 4 }}>Saved $$</div>
        </div>
      </div>

      {/* Preferences */}
      <div style={{ padding: '0 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: 1, marginBottom: 10 }}>PREFERENCES</div>
        {[
          { icon: '🍽️', label: 'Dietary preferences' },
          { icon: '🚚', label: 'Delivery preferences' },
          { icon: '🔔', label: 'Notification settings' }
        ].map((item, idx) => (
          <div key={idx} style={{ background: 'var(--surface)', borderRadius: 16, padding: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{item.label}</span>
            <span style={{ color: 'var(--muted)', fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>

      {/* Subscriptions */}
      <div style={{ padding: '0 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: 1, marginBottom: 10 }}>SUBSCRIPTIONS</div>
        <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: 20 }}>💎</span>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>My subscriptions</span>
          <span style={{ background: '#f26d24', color: 'white', fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 999 }}>Talabat Pro</span>
          <span style={{ color: 'var(--muted)', fontSize: 18 }}>›</span>
        </div>
      </div>

      {/* Support */}
      <div style={{ padding: '0 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: 1, marginBottom: 10 }}>SUPPORT</div>
        <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: 20 }}>❓</span>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Help & support</span>
          <span style={{ color: 'var(--muted)', fontSize: 18 }}>›</span>
        </div>
      </div>
    </div>
  );
}

/* ── BOTTOM NAVIGATION ── */
function BottomNav({ activeTab, onNavigate }: { activeTab: string; onNavigate: (tab: string) => void }) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 500, margin: '0 auto', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-around', padding: '10px 0 16px', zIndex: 50 }}>
      {[
        { name: 'home', icon: '🏠', label: 'Home' },
        { name: 'search', icon: '🔍', label: 'Search' },
        { name: 'saved', icon: '🔖', label: 'Saved' },
        { name: 'profile', icon: '👤', label: 'Profile' }
      ].map(item => (
        <button key={item.name} onClick={() => onNavigate(item.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: activeTab === item.name ? 'var(--accent)' : 'var(--muted)' }}>
          <span style={{ fontSize: 22 }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
