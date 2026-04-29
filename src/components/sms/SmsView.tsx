import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCheck,
  ChevronDown,
  FileSpreadsheet,
  Filter,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Smile,
  Sparkles,
} from "lucide-react";
import { buildSmsConversations, smsUnreadTotal, type SmsConversation } from "@/data/smsSampleData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PagedTableFooter } from "@/components/ui/paged-table-footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ROWS_OPTIONS = [20, 50, 100] as const;
const SMS_CHAR_LIMIT = 140;

function initials(name: string): string {
  const p = name.split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[1][0]).toUpperCase();
}

function avatarColor(seed: string): string {
  const hues = [210, 262, 330, 24, 160, 200];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h += seed.charCodeAt(i);
  return `hsl(${hues[h % hues.length]} 55% 45%)`;
}

type InboxTab = "all" | "unread" | "starred";

export function SmsView() {
  const allConversations = useMemo(() => buildSmsConversations(), []);
  const [tab, setTab] = useState<InboxTab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(allConversations[0]?.id ?? "");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [draft, setDraft] = useState("");
  const [aiComposeOpen, setAiComposeOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showTyping, setShowTyping] = useState(true);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allConversations.filter((c) => {
      if (tab === "unread" && c.unread === 0) return false;
      if (tab === "starred" && !c.starred) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
        c.lastPreview.toLowerCase().includes(q)
      );
    });
  }, [allConversations, tab, search]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);
  const summaryFrom = total === 0 ? 0 : start + 1;
  const summaryTo = Math.min(start + rowsPerPage, total);

  const selected = allConversations.find((c) => c.id === selectedId) ?? allConversations[0];
  const unreadThreads = smsUnreadTotal(allConversations);

  const applyAiDraft = () => {
    const hint = aiPrompt.trim() || "friendly follow-up about their Android messaging issue";
    setDraft(
      `Hi ${selected?.name ?? "there"} — thanks for your patience. ${hint.charAt(0).toUpperCase()}${hint.slice(1)}. Let me know if you need anything else.`,
    );
    setAiComposeOpen(false);
    setAiPrompt("");
    toast.success("Draft inserted — review before sending.");
  };

  const sendMessage = () => {
    const t = draft.trim();
    if (!t.length) return;
    if (t.length > SMS_CHAR_LIMIT) {
      toast.error(`Message must be ${SMS_CHAR_LIMIT} characters or fewer.`);
      return;
    }
    toast.success("Message queued (demo)");
    setDraft("");
    setShowTyping(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">
        <header className="relative overflow-hidden rounded-2xl border border-primary/15 p-4 shadow-soft sm:p-5">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-violet-500/[0.07] to-accent/[0.12]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent dark:via-white/[0.05]" aria-hidden />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">Text Messages</h1>
              <p className="mt-0.5 text-sm font-medium text-foreground/80">
                Send SMS from your Twilio numbers with AI-assisted summaries and compose.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button className="gradient-primary text-primary-foreground shadow-glow gap-2" onClick={() => toast.message("New thread (demo)")}>
                <Plus className="size-4" />
                Send New Text
              </Button>
              <Button variant="outline" className="gap-2 border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40">
                <FileSpreadsheet className="size-4" />
                <span className="hidden sm:inline">Export Text Message Report</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" className="gap-1">
                    Quick Links
                    <ChevronDown className="size-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => toast.message("Templates (demo)")}>Message templates</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.message("Twilio console (demo)")}>Twilio numbers</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.message("Help (demo)")}>SMS help center</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="outline" size="icon" aria-label="Filter inbox">
                    <Filter className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Inbox filters</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        <div className="flex min-h-[min(640px,calc(100dvh-12rem))] flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
          <Card className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-border shadow-soft lg:max-w-[380px] lg:flex-[0_0_380px]">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-foreground">Text Messages</h2>
                <Badge variant="secondary" className="tabular-nums">
                  {allConversations.length}
                </Badge>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search conversations…"
                    className="h-9 pl-8"
                    aria-label="Search conversations"
                  />
                </div>
                <Button type="button" variant="outline" size="icon" className="shrink-0" aria-label="Advanced filters">
                  <Filter className="size-4" />
                </Button>
              </div>
              <Tabs value={tab} onValueChange={(v) => { setTab(v as InboxTab); setPage(1); }} className="mt-3">
                <TabsList className="grid h-9 w-full grid-cols-3">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="gap-1 text-xs sm:text-sm">
                    Unread
                    {unreadThreads > 0 ? (
                      <Badge variant="default" className="h-5 min-w-5 px-1 text-[10px] tabular-nums">
                        {unreadThreads}
                      </Badge>
                    ) : null}
                  </TabsTrigger>
                  <TabsTrigger value="starred" className="text-xs sm:text-sm">
                    Starred
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ScrollArea className="min-h-0 flex-1">
              <ul className="divide-y divide-border p-2" role="listbox" aria-label="Conversations">
                {pageRows.map((c) => (
                  <ConversationRow
                    key={c.id}
                    conversation={c}
                    selected={c.id === selectedId}
                    onSelect={() => setSelectedId(c.id)}
                  />
                ))}
              </ul>
            </ScrollArea>
            <div className="border-t border-border p-2">
              <PagedTableFooter
                aria-label="Conversation list pagination"
                layout="stacked"
                showRowsPerPage={false}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={setRowsPerPage}
                rowOptions={ROWS_OPTIONS}
                summaryFrom={summaryFrom}
                summaryTo={summaryTo}
                total={total}
                page={safePage}
                pageCount={pageCount}
                onPageChange={setPage}
              />
            </div>
          </Card>

          {selected ? (
            <ChatPanel
              conversation={selected}
              draft={draft}
              setDraft={setDraft}
              onSend={sendMessage}
              onOpenAiCompose={() => setAiComposeOpen(true)}
              showTyping={showTyping}
            />
          ) : (
            <Card className="flex flex-1 items-center justify-center border-dashed p-8 text-center text-muted-foreground">
              Select a conversation
            </Card>
          )}
        </div>
      </div>

      <Sheet open={aiComposeOpen} onOpenChange={setAiComposeOpen}>
        <SheetContent className="flex flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              AI Compose
            </SheetTitle>
            <SheetDescription>
              Describe what you want to say. A draft will be inserted into the composer for you to edit.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 flex-1 space-y-2">
            <Label htmlFor="ai-compose-prompt">Instructions</Label>
            <Textarea
              id="ai-compose-prompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Ask them to try clearing the SMS app cache and confirm their OS version."
              className="min-h-[140px] resize-none"
            />
          </div>
          <SheetFooter className="gap-2 sm:flex-col sm:space-x-0">
            <Button type="button" className="gradient-primary text-primary-foreground shadow-glow w-full gap-2" onClick={applyAiDraft}>
              <Sparkles className="size-4" />
              Generate draft
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ConversationRow({
  conversation: c,
  selected,
  onSelect,
}: {
  conversation: SmsConversation;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        onClick={onSelect}
        className={cn(
          "flex w-full gap-3 rounded-xl border-l-4 py-3 pl-2 pr-2 text-left transition-colors",
          selected ? "border-primary bg-primary/10" : "border-transparent hover:bg-muted/60",
        )}
      >
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: avatarColor(c.id) }}
        >
          {initials(c.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="truncate font-medium text-foreground">{c.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">{c.lastAt}</span>
          </div>
          <p className="truncate text-xs text-muted-foreground">{c.phone}</p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{c.lastPreview}</p>
        </div>
        {c.unread > 0 ? (
          <Badge className="h-6 min-w-6 shrink-0 justify-center px-1.5 tabular-nums">{c.unread}</Badge>
        ) : null}
      </button>
    </li>
  );
}

function ChatPanel({
  conversation: c,
  draft,
  setDraft,
  onSend,
  onOpenAiCompose,
  showTyping,
}: {
  conversation: SmsConversation;
  draft: string;
  setDraft: (v: string) => void;
  onSend: () => void;
  onOpenAiCompose: () => void;
  showTyping: boolean;
}) {
  const len = draft.length;
  const over = len > SMS_CHAR_LIMIT;

  return (
    <Card className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-border shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold text-foreground">{c.name}</h2>
            {c.online ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
                Online
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Twilio: <span className="font-mono text-foreground/90">{c.twilioNumber}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="Call contact">
                <Phone className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Call</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="Add">
                <Plus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="More options">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark unread</DropdownMenuItem>
              <DropdownMenuItem>Star conversation</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          <div className="kpi-card shadow-soft rounded-2xl border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 shrink-0 text-primary" />
                <span className="font-semibold text-foreground">AI Summary</span>
                <Badge variant="outline" className="text-[10px] font-normal">
                  Beta
                </Badge>
              </div>
              <Button type="button" variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
                View insights
                <span aria-hidden>→</span>
              </Button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{c.aiSummary}</p>
          </div>

          <div className="space-y-4">
            {c.messages.map((m) => (
              <div key={m.id}>
                {m.dateDivider ? (
                  <p className="mb-4 text-center text-xs font-medium text-muted-foreground">{m.dateDivider}</p>
                ) : null}
                {m.direction === "out" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[min(100%,420px)]">
                      <div
                        className={cn(
                          "rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-white shadow-sm",
                          "bg-gradient-to-br from-[#094E9B] to-[#0d62c9]",
                        )}
                      >
                        <p>{m.body}</p>
                        {m.hasAttachmentStrip ? (
                          <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-2 py-1.5 text-xs">
                            <span className="rounded bg-white/20 px-1.5 py-0.5 font-medium">IMG</span>
                            {m.attachmentLabel ?? "Attachment"}
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-1 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                        <span>{m.sentAt}</span>
                        {m.delivered ? (
                          <span className="flex items-center gap-0.5 text-sky-600 dark:text-sky-400">
                            Delivered
                            <CheckCheck className="size-3.5" aria-hidden />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="max-w-[min(100%,420px)]">
                      <div className="rounded-2xl rounded-bl-md border border-border bg-muted/80 px-4 py-2.5 text-sm text-foreground shadow-sm">
                        <p>{m.body}</p>
                        {m.reactions?.length ? (
                          <div className="mt-2 flex items-center gap-1">
                            {m.reactions.map((r) => (
                              <span key={r} className="rounded-full border border-border bg-background px-2 py-0.5 text-xs">
                                {r}
                              </span>
                            ))}
                            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground">
                              +
                            </Button>
                          </div>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{m.sentAt}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

            {showTyping ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{c.name}</span> is typing
              <span className="inline-flex items-center gap-1 pl-1 align-middle" aria-hidden>
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="inline-block size-1 animate-bounce rounded-full bg-muted-foreground/80"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
            </p>
          ) : null}
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-muted/20 p-3">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your message…"
            className="min-h-[88px] resize-none border-0 bg-transparent px-3 py-3 text-sm shadow-none focus-visible:ring-0"
            aria-label="Message body"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-2 py-2">
            <div className="flex flex-wrap items-center gap-1">
              <Button type="button" variant="ghost" size="sm" className="text-xs text-muted-foreground">
                Templates
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-xs font-semibold text-primary"
                onClick={onOpenAiCompose}
              >
                <Sparkles className="size-3.5" />
                AI Compose
                <Badge className="h-5 px-1.5 text-[10px] font-normal">New</Badge>
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground" aria-label="Attach file">
                <Paperclip className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground" aria-label="Emoji">
                <Smile className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("text-xs tabular-nums text-muted-foreground", over && "font-medium text-destructive")}>
                {len} / {SMS_CHAR_LIMIT}
              </span>
              <Button
                type="button"
                size="icon"
                className="gradient-primary shrink-0 text-primary-foreground shadow-glow"
                aria-label="Send message"
                disabled={!draft.trim() || over}
                onClick={onSend}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
