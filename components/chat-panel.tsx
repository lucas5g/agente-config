'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Agent = { id: string; name: string; systemPrompt: string };

function MarkdownMessage({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="whitespace-pre-wrap leading-relaxed">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
        ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
        code: ({ children }) => <code className="rounded bg-slate-950/70 px-1 py-0.5 text-xs">{children}</code>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

export function ChatPanel({
  agent,
  conversationId,
  initialMessages,
}: {
  agent: Agent;
  conversationId?: string;
  initialMessages: UIMessage[];
}) {
  const conversationIdRef = useRef(conversationId);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error, setMessages } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          agentId: agent.id,
          conversationId: conversationIdRef.current,
          messages,
        },
      }),
    }),
  });

  async function ensureConversation() {
    if (conversationIdRef.current) return;

    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ agentId: agent.id }),
    });
    const conversation = (await response.json()) as { id: string };
    conversationIdRef.current = conversation.id;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    await ensureConversation();
    setInput('');
    sendMessage({ text });
  }

  async function clearConversation() {
    if (conversationIdRef.current) {
      await fetch(`/api/conversations/${conversationIdRef.current}`, { method: 'DELETE' });
      conversationIdRef.current = undefined;
    }
    setMessages([]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold">{agent.name}</h2>
        <p className="mt-3 text-sm text-slate-400">Prompt ativo</p>
        <p className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
          {agent.systemPrompt}
        </p>
        <button onClick={clearConversation} className="mt-4 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
          Limpar conversa
        </button>
      </aside>

      <section className="flex min-h-[70vh] flex-col rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="flex-1 space-y-4 overflow-auto p-5">
          {messages.length ? (
            messages.map(message => (
              <div key={message.id} className={message.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === 'user' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-100'}`}>
                  <div className="mb-1 text-xs font-semibold uppercase opacity-70">{message.role}</div>
                  {message.parts.map((part, index) => {
                    if (part.type === 'text') {
                      return <MarkdownMessage key={index}>{part.text}</MarkdownMessage>;
                    }
                    if (part.type.startsWith('tool-')) {
                      return (
                        <pre key={index} className="mt-2 overflow-auto rounded-lg bg-slate-950 p-3 text-left text-xs text-slate-300">
                          {JSON.stringify(part, null, 2)}
                        </pre>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-slate-400">Envie uma mensagem para iniciar a conversa.</p>
          )}
          {error ? <p className="rounded-lg bg-red-950 p-3 text-sm text-red-200">{error.message}</p> : null}
        </div>
        <form onSubmit={onSubmit} className="border-t border-slate-800 p-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-lg border border-slate-700 px-3 py-2"
            />
            <button disabled={status !== 'ready'} className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
              Enviar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
