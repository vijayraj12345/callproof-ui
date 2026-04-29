import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Pencil,
  Trash2,
  PlusCircle,
  Star,
  Navigation2,
  Route,
  Map as MapIcon,
  Building2,
  Calendar,
  Crosshair,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  UserPlus,
  StickyNote,
  Users,
  Briefcase,
  Clock,
  CalendarPlus,
  AtSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { contactsSampleData, type Contact } from "@/data/contactsSampleData";

const BRAND_BLUE = "#094E9B";

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={cn(
              "size-3.5",
              filled ? "fill-amber-400 stroke-amber-400" : "stroke-muted-foreground/40",
            )}
          />
        );
      })}
    </div>
  );
}

function TypeBadge({ type }: { type: Contact["type"] }) {
  const map: Record<Contact["type"], string> = {
    Prospect: "bg-violet-100 text-violet-900 border-violet-200",
    Dealer: "bg-amber-100 text-amber-900 border-amber-200",
    Customer: "bg-emerald-100 text-emerald-900 border-emerald-200",
    Lead: "bg-sky-100 text-sky-900 border-sky-200",
  };
  return (
    <Badge variant="outline" className={cn("text-[11px] font-semibold", map[type])}>
      {type}
    </Badge>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 py-1 text-xs">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-primary/70" />
      <div className="min-w-0 flex-1">
        <span className="font-semibold text-foreground/70">{label}: </span>
        <span className="text-foreground">{children}</span>
      </div>
    </div>
  );
}

function ActionIcon({
  icon: Icon,
  label,
  className,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("size-8 rounded-lg", className)}
          aria-label={label}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function ContactCard({
  contact,
  selected,
  onSelect,
}: {
  contact: Contact;
  selected: boolean;
  onSelect: (c: Contact) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      onClick={() => onSelect(contact)}
      className={cn(
        "group flex cursor-pointer flex-col gap-3 rounded-2xl border bg-card p-3 shadow-soft transition-smooth",
        selected
          ? "border-primary/50 ring-2 ring-primary/30"
          : "border-border hover:border-primary/30 hover:shadow-elevated",
      )}
    >
      {/* Top row: avatar + headline + actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div
          className={cn(
            "relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-2xl font-bold text-white sm:h-24 sm:w-24",
            contact.heroColor,
          )}
        >
          <span className="drop-shadow">{contact.avatarLabel}</span>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/55 to-transparent p-1.5">
            <Navigation2 className="size-3 text-white/90" />
            <span className="text-[10px] font-medium text-white/95">
              {contact.distanceMiles.toFixed(1)} mi
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground">
                {contact.name}
              </h3>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <Stars value={contact.rating} />
                <span className="font-medium text-foreground">
                  {contact.rating.toFixed(1)}
                </span>
                <span>({contact.reviews})</span>
                {contact.priceTier && (
                  <span className="font-medium text-foreground/80">
                    · {contact.priceTier}
                  </span>
                )}
              </div>
            </div>
            <TypeBadge type={contact.type} />
          </div>

          {/* Always-visible essentials */}
          <div className="mt-1.5 space-y-0.5">
            <DetailRow icon={MapPin} label="Address">
              {contact.address}
            </DetailRow>
            {contact.lastNote && (
              <DetailRow icon={StickyNote} label="Last note">
                {contact.lastNote}
              </DetailRow>
            )}
            <DetailRow icon={Clock} label="Contacted">
              {contact.lastContacted}
            </DetailRow>
          </div>

          {/* Phone chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {contact.phones.map((p, i) => (
              <button
                key={i}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-smooth",
                  p.isInactive
                    ? "bg-muted text-muted-foreground line-through"
                    : "bg-[hsl(var(--primary)/0.1)] text-primary hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <Phone className="size-3" />({p.kind}) {p.number}
              </button>
            ))}
            <button
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-md bg-[hsl(var(--accent)/0.12)] px-2 py-1 text-[11px] font-semibold text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <MessageSquare className="size-3" />
              SMS
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details (matches legacy "Show More" payload) */}
      {expanded && (
        <div className="grid grid-cols-1 gap-x-4 rounded-xl bg-muted/40 p-3 sm:grid-cols-2">
          <DetailRow icon={Briefcase} label="Account">
            {contact.account ?? "None"}
          </DetailRow>
          <DetailRow icon={CalendarPlus} label="Created">
            {contact.createdAt}
          </DetailRow>
          <DetailRow icon={AtSign} label="Email">
            {contact.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="text-primary underline-offset-2 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {contact.email}
              </a>
            ) : (
              "None"
            )}
          </DetailRow>
          {contact.bookedToday !== undefined && (
            <DetailRow icon={Calendar} label="Booked today">
              {contact.bookedToday} times
            </DetailRow>
          )}
          <div className="sm:col-span-2">
            <DetailRow icon={Users} label="Contacts">
              <span className="flex flex-wrap gap-1">
                {contact.contactsList.map((c) => (
                  <span
                    key={c}
                    className="rounded bg-card px-1.5 py-0.5 text-[11px] text-primary"
                  >
                    {c}
                  </span>
                ))}
              </span>
            </DetailRow>
          </div>
          <div className="sm:col-span-2">
            <DetailRow icon={Building2} label="Sales Reps">
              <span className="flex flex-wrap gap-1">
                {contact.salesReps.map((r) => (
                  <span
                    key={r}
                    className="rounded bg-card px-1.5 py-0.5 text-[11px] text-foreground underline-offset-2 hover:underline"
                  >
                    {r}
                  </span>
                ))}
              </span>
            </DetailRow>
          </div>
          {contact.nextTask && (
            <div className="sm:col-span-2">
              <DetailRow icon={Calendar} label="Next Task">
                <span className="text-primary">{contact.nextTask}</span>
              </DetailRow>
            </div>
          )}
          {contact.tags.length > 0 && (
            <div className="sm:col-span-2 flex flex-wrap gap-1 pt-1">
              {contact.tags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="text-[10px] font-medium"
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer: show more + action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          {expanded ? (
            <>
              <ChevronUp className="size-3.5" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="size-3.5" /> Show More
            </>
          )}
        </button>

        <div className="flex flex-wrap items-center gap-0.5">
          <ActionIcon icon={Eye} label="View notes" className="text-violet-600 hover:bg-violet-50" />
          <ActionIcon icon={FileText} label="Add note" className="text-fuchsia-600 hover:bg-fuchsia-50" />
          <ActionIcon icon={PlusCircle} label="Add task" className="text-sky-600 hover:bg-sky-50" />
          <ActionIcon icon={CalendarPlus} label="Schedule" className="text-emerald-600 hover:bg-emerald-50" />
          <ActionIcon icon={Pencil} label="Edit" className="text-blue-600 hover:bg-blue-50" />
          <ActionIcon icon={Trash2} label="Delete" className="text-rose-600 hover:bg-rose-50" />
          <ActionIcon icon={Mail} label="Email" className="text-orange-600 hover:bg-orange-50" />
          <ActionIcon icon={UserPlus} label="Add contact" className="text-teal-600 hover:bg-teal-50" />
          <ActionIcon icon={Route} label="Add to route" className="text-indigo-600 hover:bg-indigo-50" />
        </div>
      </div>
    </article>
  );
}

/** Stylized SVG mock map with pins */
function MockMap({
  contacts,
  selectedId,
  onSelect,
}: {
  contacts: Contact[];
  selectedId: number;
  onSelect: (c: Contact) => void;
}) {
  // Project lat/lng to viewBox coords (purely cosmetic mock projection)
  const W = 800;
  const H = 800;
  const lats = contacts.map((c) => c.lat);
  const lngs = contacts.map((c) => c.lng);
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs),
    maxLng = Math.max(...lngs);
  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / Math.max(0.0001, maxLng - minLng)) * (W - 120) + 60;
    const y = H - (((lat - minLat) / Math.max(0.0001, maxLat - minLat)) * (H - 120) + 60);
    return { x, y };
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {/* Map controls */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1 rounded-lg border border-border bg-card shadow-md">
        <button className="flex size-8 items-center justify-center text-foreground hover:bg-muted">+</button>
        <div className="h-px bg-border" />
        <button className="flex size-8 items-center justify-center text-foreground hover:bg-muted">−</button>
      </div>
      <div className="absolute right-3 top-3 z-10 flex gap-1">
        <Button size="icon" variant="outline" className="size-8 bg-card">
          <Crosshair className="size-4" />
        </Button>
      </div>
      <div className="absolute right-3 bottom-3 z-10 flex gap-2">
        <Button size="sm" className="gradient-primary text-primary-foreground gap-1.5 shadow-glow">
          <Route className="size-3.5" />
          Save Route
        </Button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          </pattern>
          <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--gradient-soft))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="park" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="hsl(160 60% 80%)" />
            <stop offset="100%" stopColor="hsl(160 50% 88%)" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="hsl(210 40% 96%)" />
        <rect width={W} height={H} fill="url(#grid)" opacity="0.5" />

        {/* Decorative landmasses */}
        <path d="M0,520 Q200,460 400,500 T800,470 L800,800 L0,800 Z" fill="hsl(200 55% 88%)" opacity="0.6" />
        <ellipse cx="200" cy="300" rx="140" ry="80" fill="url(#park)" opacity="0.7" />
        <ellipse cx="620" cy="200" rx="100" ry="60" fill="url(#park)" opacity="0.7" />

        {/* Roads */}
        <path d="M0,400 L800,420" stroke="hsl(var(--border))" strokeWidth="6" />
        <path d="M400,0 L420,800" stroke="hsl(var(--border))" strokeWidth="6" />
        <path d="M50,650 Q400,600 760,680" stroke="hsl(var(--border))" strokeWidth="3" fill="none" />
        <path d="M100,100 Q300,300 700,200" stroke="hsl(var(--border))" strokeWidth="3" fill="none" />

        {/* Pins */}
        {contacts.map((c) => {
          const { x, y } = project(c.lat, c.lng);
          const active = c.id === selectedId;
          return (
            <g
              key={c.id}
              transform={`translate(${x}, ${y})`}
              onClick={() => onSelect(c)}
              className="cursor-pointer"
            >
              {active && (
                <circle r="26" fill={BRAND_BLUE} opacity="0.18" className="animate-pulse" />
              )}
              <circle r={active ? 18 : 14} fill={active ? BRAND_BLUE : "white"} stroke={BRAND_BLUE} strokeWidth="3" />
              <text
                textAnchor="middle"
                dy="4"
                fontSize="11"
                fontWeight="700"
                fill={active ? "white" : BRAND_BLUE}
              >
                {c.avatarLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ContactsView() {
  const [contacts] = useState<Contact[]>(contactsSampleData);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Contact["type"]>("all");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "name">("distance");
  const [selectedId, setSelectedId] = useState<number>(contacts[0].id);

  const filtered = useMemo(() => {
    let list = contacts.filter((c) => {
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (
        search &&
        !`${c.name} ${c.address} ${c.tags.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "distance") return a.distanceMiles - b.distanceMiles;
      if (sortBy === "rating") return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [contacts, search, typeFilter, sortBy]);

  const selected = filtered.find((c) => c.id === selectedId) ?? filtered[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-primary/15 p-4 shadow-soft sm:p-5">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-violet-500/[0.07] to-accent/[0.12]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gradient-primary sm:text-3xl">
              Accounts &amp; Contacts
            </h1>
            <p className="mt-0.5 text-sm font-medium text-foreground/80">
              {filtered.length} accounts available · explore on the map or jump straight in.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Building2 className="size-4" />
              Account Actions
              <ChevronDown className="size-3.5" />
            </Button>
            <Button className="gradient-primary text-primary-foreground shadow-glow gap-2">
              <PlusCircle className="size-4" />
              Add Account
            </Button>
          </div>
        </div>

        {/* Search & filter row */}
        <div className="relative mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, address, or tag…"
              className="pl-9 bg-card"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
            <SelectTrigger className="w-full sm:w-40 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
              <SelectItem value="Dealer">Dealer</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-full sm:w-44 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Sort: Distance</SelectItem>
              <SelectItem value="rating">Sort: Rating</SelectItem>
              <SelectItem value="name">Sort: Name</SelectItem>
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>More filters</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Split content: list (left) + map (right) */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* List */}
        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">
          {filtered.map((c) => (
            <ContactCard
              key={c.id}
              contact={c}
              selected={c.id === selected?.id}
              onSelect={(x) => setSelectedId(x.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-card text-muted-foreground">
              No matching accounts.
            </div>
          )}
        </div>

        {/* Map + selected detail */}
        <div className="flex min-h-[420px] flex-col gap-3 lg:sticky lg:top-0 lg:h-[calc(100dvh-220px)]">
          <div className="flex-1">
            <MockMap
              contacts={filtered}
              selectedId={selected?.id ?? -1}
              onSelect={(c) => setSelectedId(c.id)}
            />
          </div>

          {selected && (
            <div className="rounded-2xl border border-border bg-card p-3 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold text-foreground">
                      {selected.name}
                    </h4>
                    <TypeBadge type={selected.type} />
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {selected.address}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="size-8 text-primary">
                        <Phone className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Call</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="size-8 text-accent">
                        <MessageSquare className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>SMS</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="size-8">
                        <Mail className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Email</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="size-8">
                        <Pencil className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                <div>
                  <div className="text-[10px] uppercase tracking-wide">Last contacted</div>
                  <div className="font-medium text-foreground">{selected.lastContacted}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide">Next task</div>
                  <div className="font-medium text-foreground">
                    {selected.nextTask ?? "—"}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] uppercase tracking-wide">Sales reps</div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {selected.salesReps.map((r) => (
                      <Badge key={r} variant="secondary" className="text-[10px]">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-sm shadow-soft">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Rows per page:</span>
          <Select defaultValue="20">
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>1–{filtered.length} of {filtered.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <MapIcon className="size-3.5" />
            Map view
          </Button>
          <Button variant="outline" size="sm">Company Active Stats</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow">
            Export Contacts
          </Button>
        </div>
      </div>
    </div>
  );
}
