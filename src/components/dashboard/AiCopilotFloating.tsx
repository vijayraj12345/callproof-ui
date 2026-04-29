import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Send, Sparkles, Star, X } from "lucide-react";
import { v7Appointments, v7Deals, v7Team } from "@/data/dashboardV7SampleData";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
};

function formatTime(d = new Date()) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function buildReply(q: string): string {
  const m = q.toLowerCase();
  if (/risk|urgent|danger/.test(m)) {
    const r = v7Deals.filter((d) => d.risk === "high");
    return `${r.length} deals at risk:\n\n${r.map((d) => `• ${d.name} ($${(d.value / 1000).toFixed(0)}k) — ${d.signals[0]}`).join("\n")}\n\nCall ${r[0]?.contact ?? "your top contact"} first.`;
  }
  if (/team|perform|rank/.test(m)) {
    return `Team this week:\n\n${[...v7Team]
      .sort((a, b) => b.score - a.score)
      .map((t, i) => `${i + 1}. ${t.name} — ${t.score} ${t.trend === "up" ? "↑" : "↓"}`)
      .join("\n")}`;
  }
  if (/pipeline|deal|total/.test(m)) {
    const total = v7Deals.reduce((s, d) => s + d.value, 0);
    return `$${(total / 1000).toFixed(0)}k across ${v7Deals.length} deals:\n\n${v7Deals.map((d) => `• ${d.name} — $${(d.value / 1000).toFixed(0)}k · ${d.stage}`).join("\n")}`;
  }
  if (/appoint|meeting|prep|brief/.test(m)) {
    return `3 appointments today:\n\n${v7Appointments.map((a) => `• ${a.time} — ${a.company} (${a.label})`).join("\n")}`;
  }
  for (const d of v7Deals) {
    if (m.includes(d.name.toLowerCase().split(" ")[0])) {
      return `${d.name} — $${(d.value / 1000).toFixed(0)}k · ${d.stage}\nContact: ${d.contact}\n${d.silent > 0 ? `Silent: ${d.silent} days\n` : ""}\n${d.signals.map((s) => `• ${s}`).join("\n")}`;
    }
  }
  return `Your most urgent move right now: follow up on hot deals in the feed.\n\nTry asking: "deals at risk", "team", "appointments today", or name a company.`;
}

function TypingDots() {
  return (
    <div className="flex w-fit gap-1 rounded-lg border border-[#e5e7eb] bg-[#f4f6f9] px-2.5 py-1.5">
      <span className="size-1 animate-bounce rounded-full bg-[#9ca3af]" />
      <span className="size-1 animate-bounce rounded-full bg-[#9ca3af] [animation-delay:150ms]" />
      <span className="size-1 animate-bounce rounded-full bg-[#9ca3af] [animation-delay:300ms]" />
    </div>
  );
}

/**
 * Fixed AI Copilot panel + FAB — matches `callproof-v7` #chat / #fab (bottom-right).
 */
export function AiCopilotFloating() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      text: "Hey. I'm watching your pipeline and team in real time. Ask me anything.",
      time: "now",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 200);
    return () => window.clearTimeout(t);
  }, [open]);

  const send = useCallback(() => {
    const v = input.trim();
    if (!v) return;
    const t = formatTime();
    setInput("");
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: v, time: t }]);
    setTyping(true);
    const delay = Math.min(700 + v.length * 8, 1300);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", text: buildReply(v), time: formatTime() },
      ]);
    }, delay);
  }, [input]);

  return (
    <>
      <div
        id={panelId}
        role="dialog"
        aria-label="AI Copilot"
        aria-hidden={!open}
        className={cn(
          "fixed z-[300] flex w-[min(316px,calc(100vw-32px))] flex-col overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "bottom-[66px] right-4 max-h-[min(480px,calc(100dvh-120px))]",
          open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-2.5 scale-[0.97] opacity-0",
        )}
      >
        <div className="flex items-center gap-2 border-b border-[rgba(124,58,237,0.1)] bg-gradient-to-r from-[rgba(124,58,237,0.07)] to-[rgba(249,115,22,0.03)] px-3 py-2.5">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#7c3aed] to-[#f97316] text-white">
            <Sparkles className="size-3.5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-bold text-[#111827]">AI Copilot</div>
            <div className="font-mono text-[9px] font-medium uppercase tracking-wide text-[#7c3aed]">CallProof · Live</div>
          </div>
          <button
            type="button"
            className="ml-auto flex size-[22px] shrink-0 items-center justify-center rounded border border-[#e5e7eb] bg-white text-[#9ca3af] transition-colors hover:bg-[#f4f6f9] hover:text-[#374151]"
            aria-label="Close AI Copilot"
            onClick={() => setOpen(false)}
          >
            <X className="size-3" strokeWidth={2.5} />
          </button>
        </div>

        <div ref={listRef} className="flex min-h-[160px] max-h-[250px] flex-col gap-2 overflow-y-auto p-2.5">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex flex-col gap-0.5", msg.role === "user" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[88%] rounded-lg px-2.5 py-1.5 text-[12.5px] leading-snug",
                  msg.role === "user"
                    ? "rounded-br-sm bg-gradient-to-br from-[#7c3aed] to-[#ec4899] text-white"
                    : "rounded-bl-sm border border-[#e5e7eb] bg-[#f4f6f9] text-[#111827]",
                )}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
              <span className="px-1 font-mono text-[9px] text-[#9ca3af]">{msg.time}</span>
            </div>
          ))}
          {typing ? (
            <div className="flex flex-col gap-0.5">
              <TypingDots />
            </div>
          ) : null}
        </div>

        <div className="flex gap-1.5 border-t border-[#e5e7eb] p-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Ask anything…"
            className="h-[30px] min-w-0 flex-1 rounded-md border border-[#e5e7eb] bg-[#f4f6f9] px-2.5 text-[12.5px] text-[#111827] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#7c3aed]"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            aria-label="Message AI Copilot"
          />
          <button
            type="button"
            className="flex size-[30px] shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#7c3aed] to-[#f97316] text-white transition-transform hover:scale-105"
            aria-label="Send"
            onClick={send}
          >
            <Send className="size-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close AI Copilot" : "Open AI Copilot"}
        className={cn(
          "fixed bottom-4 right-4 z-[400] flex size-[42px] items-center justify-center rounded-full text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] transition-transform duration-150",
          "bg-gradient-to-br from-[#7c3aed] to-[#f97316] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]",
        )}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X className="size-[18px]" strokeWidth={1.8} /> : <Star className="size-[18px]" strokeWidth={1.8} />}
      </button>
    </>
  );
}
