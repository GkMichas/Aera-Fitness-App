"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, RotateCcw } from "lucide-react";
import type { CoachAction, CoachIntent, CoachMessage } from "@/types/coach";

const suggestions = ["What should I train today?", "What should I eat now?", "I slept badly. Should I train?"];
const welcome: CoachMessage = {
  id: "welcome",
  role: "assistant",
  content: "Ask about your training, nutrition, recovery or progress. I’ll use only the records relevant to your question.",
  createdAt: "",
};

interface CoachApiResponse {
  content: string;
  actions: CoachAction[];
  intent: CoachIntent;
  conversationId: string | null;
  isDemo: boolean;
  error?: string;
}

export function CoachChat() {
  const [messages, setMessages] = useState<CoachMessage[]>([welcome]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [lastMessage, setLastMessage] = useState<string>();
  const [demo, setDemo] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function send(message: string) {
    const text = message.trim();
    if (!text || pending) return;
    const userMessage: CoachMessage = { id: `user-${Date.now()}`, role: "user", content: text, createdAt: new Date().toISOString() };
    const history = messages.filter((item) => item.id !== "welcome").map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(undefined);
    setLastMessage(text);
    setPending(true);
    try {
      const response = await fetch("/api/coach", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: text, conversationId, history }) });
      const payload = await response.json() as CoachApiResponse;
      if (!response.ok) throw new Error(payload.error || "The Coach is unavailable right now.");
      setConversationId(payload.conversationId ?? conversationId);
      setDemo(payload.isDemo);
      setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: "assistant", content: payload.content, actions: payload.actions, intent: payload.intent, createdAt: new Date().toISOString() }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The Coach is unavailable right now.");
    } finally {
      setPending(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-150px)] max-w-4xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-[var(--aera-ivory)] lg:min-h-[calc(100dvh-80px)]">
      <header className="flex items-start justify-between border-b border-black/10 px-5 py-4 sm:px-7">
        <div><h1 className="text-xl font-bold tracking-[.14em]">AERA</h1><p className="mt-1 text-sm text-black/55">Your personal coach.</p></div>
        {demo && <span className="rounded-full bg-[var(--aera-stone)] px-3 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-black/50">Preview context</span>}
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-7" aria-live="polite">
        <p className="text-center text-xs text-black/40">Today</p>
        {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        {pending && <div className="max-w-[88%] self-start rounded-[14px_14px_14px_4px] border border-black/10 bg-white px-4 py-3 text-sm text-black/45"><span className="animate-pulse">Reviewing relevant context…</span></div>}
        {error && <div role="alert" className="max-w-[92%] self-start rounded-[14px_14px_14px_4px] border border-[var(--aera-critical)]/35 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--aera-critical)]">Couldn&apos;t reach the coach</p><p className="mt-2 text-sm leading-6 text-black/75">{error} Your existing data is unchanged.</p><button type="button" onClick={() => lastMessage && void send(lastMessage)} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--aera-terracotta)] px-4 text-sm font-bold text-white"><RotateCcw size={15} /> Retry</button></div>}
        {!pending && messages.length < 3 && <div className="mt-auto flex flex-wrap gap-2 pt-5">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void send(suggestion)} className="min-h-10 rounded-full bg-[var(--aera-stone)] px-4 text-left text-xs font-semibold text-black/65 hover:bg-[var(--aera-sand)]">{suggestion}</button>)}</div>}
      </div>

      <form ref={formRef} onSubmit={onSubmit} className="flex gap-2 border-t border-black/10 bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 sm:px-6">
        <label className="sr-only" htmlFor="coach-message">Ask AERA anything</label>
        <input id="coach-message" value={input} onChange={(event) => setInput(event.target.value)} maxLength={1200} disabled={pending} placeholder="Ask AERA anything" className="min-h-12 min-w-0 flex-1 rounded-full border border-black/10 bg-[var(--aera-ivory)] px-4 text-sm outline-none disabled:opacity-50" />
        <button type="submit" disabled={pending || !input.trim()} aria-label="Send message" className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--aera-terracotta)] text-white disabled:cursor-not-allowed disabled:bg-[var(--aera-stone)] disabled:text-black/35"><ArrowUp size={19} /></button>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: CoachMessage }) {
  if (message.role === "user") return <div className="max-w-[82%] self-end rounded-[14px_14px_4px_14px] bg-[var(--aera-ink)] px-4 py-3 text-[15px] leading-6 text-white">{message.content}</div>;
  return <div className="max-w-[90%] self-start space-y-2"><div className="rounded-[14px_14px_14px_4px] border border-black/10 bg-white px-4 py-3 text-[15px] leading-6">{message.content}</div>{message.actions && message.actions.length > 0 && <div className="flex flex-wrap gap-2">{message.actions.map((action) => <Link key={`${message.id}-${action.kind}`} href={action.href} className="flex min-h-11 items-center rounded-lg border border-black/15 bg-white px-4 text-sm font-bold hover:bg-[var(--aera-stone)]">{action.label}</Link>)}</div>}</div>;
}
