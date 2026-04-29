import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  DollarSign,
  FileText,
  Headphones,
  LineChart,
  Menu,
  Phone,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type CallproofMenuItem,
  type FlyoutContent,
  type SidebarNavFlyoutId,
  getFlyoutForNav,
  isExternalUrl,
} from "@/data/callproofSidebarMenu";

const DEFAULT_USER_ICON = "https://s1.callproof.com/static/images/callproof/user_icon.png";

const RAIL_W_PX = 72;
const FLYOUT_CLOSE_MS = 160;
const BRIDGE_W = 12;

const CP_BLUE = "#0d6efd";

export type SidebarProps = {
  repAvatarUrl?: string;
  userAvatarUrl?: string;
  showStats?: boolean;
  showSubscription?: boolean;
};

type NavId = SidebarNavFlyoutId;

const mainNav: {
  id: NavId;
  label: string;
  icon: typeof Phone;
  hidden?: boolean;
}[] = [
  { id: "communication", label: "Communication", icon: Phone },
  { id: "people", label: "People", icon: Users },
  { id: "sales", label: "Sales", icon: DollarSign },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "stats", label: "Stats", icon: LineChart, hidden: true },
  { id: "subscription", label: "Subscription", icon: CreditCard, hidden: true },
  { id: "support", label: "Support", icon: Headphones },
  { id: "settings", label: "Settings", icon: Settings },
];

function MenuRowLink({
  item,
  className,
  onActivate,
}: {
  item: CallproofMenuItem;
  className?: string;
  onActivate?: () => void;
}) {
  const ext = isExternalUrl(item.url);
  const cls = cn(
    "block rounded-md px-2 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0d6efd]",
    className,
  );
  if (ext) {
    return (
      <a
        href={item.url}
        className={cls}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onActivate?.()}
      >
        {item.name}
      </a>
    );
  }
  return (
    <a href={item.url} className={cls} onClick={() => onActivate?.()}>
      {item.name}
    </a>
  );
}

function FlyoutPanel({ content, onItemActivate }: { content: FlyoutContent; onItemActivate?: () => void }) {
  return (
    <div
      className="min-w-[260px] max-w-[300px] overflow-y-auto rounded-r-xl border border-slate-200/90 bg-white py-4 pl-5 pr-4 shadow-[4px_0_24px_-4px_rgba(15,23,42,0.12)]"
      style={{ maxHeight: "min(70vh, 520px)" }}
    >
      <div className="mb-4 text-xl font-semibold tracking-tight" style={{ color: CP_BLUE }}>
        CallProof
      </div>

      {content.kind === "single" ? (
        <>
          <h3 className="mb-3 text-base font-bold text-slate-900">{content.title}</h3>
          <ul className="m-0 list-none space-y-0.5 p-0">
            {content.items.length === 0 ? (
              <li className="px-2 py-4 text-sm text-slate-500">No links in this section.</li>
            ) : (
              content.items.map((item) => (
                <li key={`${item.menu_row_id}-${item.position}-${item.url}`}>
                  <MenuRowLink item={item} onActivate={onItemActivate} />
                </li>
              ))
            )}
          </ul>
        </>
      ) : (
        <>
          <h3 className="mb-3 text-base font-bold text-slate-900">{content.title}</h3>
          <div className="space-y-5">
            {content.sections.length === 0 ? (
              <p className="px-2 text-sm text-slate-500">No home menu rows configured.</p>
            ) : (
              content.sections.map((sec) => (
                <div key={sec.heading}>
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{sec.heading}</p>
                  <ul className="m-0 list-none space-y-0.5 p-0">
                    {sec.items.map((item) => (
                      <li key={`${item.menu_row_id}-${item.position}-${item.url}`}>
                        <MenuRowLink item={item} onActivate={onItemActivate} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export const Sidebar = ({
  repAvatarUrl = "https://s1.callproof.com/cache/2d/a4/2da48e286a51067e3a977c2f7ed9a842.jpg",
  userAvatarUrl = "https://s1.callproof.com/cache/5c/00/5c000324d50912c8496f63c25b9df3dc.jpg",
  showStats = false,
  showSubscription = false,
}: SidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeNav, setActiveNav] = useState<NavId>("communication");
  const [hoveredNav, setHoveredNav] = useState<NavId | null>(null);
  const [flyoutTop, setFlyoutTop] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Partial<Record<NavId, HTMLButtonElement | null>>>({});
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Settings rail icon shows Home (personal) menu; Personal/Home avatar shows Settings menu — swapped per product request. */
  const flyoutContent = useMemo(() => {
    if (!hoveredNav) return null;
    if (hoveredNav === "settings") return getFlyoutForNav("personal");
    if (hoveredNav === "personal") return getFlyoutForNav("settings");
    return getFlyoutForNav(hoveredNav);
  }, [hoveredNav]);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setHoveredNav(null);
      closeTimerRef.current = null;
    }, FLYOUT_CLOSE_MS);
  }, [cancelClose]);

  const positionFlyout = useCallback((id: NavId) => {
    const el = itemRefs.current[id];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const flyH = flyoutRef.current?.offsetHeight ?? 320;
    const pad = 8;
    const top = Math.min(Math.max(pad, r.top - (flyH - r.height) / 2), window.innerHeight - flyH - pad);
    setFlyoutTop(top);
  }, []);

  const openFlyout = useCallback(
    (id: NavId) => {
      cancelClose();
      setHoveredNav(id);
      requestAnimationFrame(() => positionFlyout(id));
    },
    [cancelClose, positionFlyout],
  );

  useLayoutEffect(() => {
    if (!hoveredNav) return;
    positionFlyout(hoveredNav);
  }, [hoveredNav, flyoutContent, positionFlyout]);

  useEffect(() => {
    if (!hoveredNav) return;
    const onResize = () => positionFlyout(hoveredNav);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hoveredNav, positionFlyout]);

  useEffect(() => {
    if (!hoveredNav) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHoveredNav(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hoveredNav]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setHoveredNav(null);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobileMenu]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) closeMobileMenu();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [closeMobileMenu]);

  useEffect(() => {
    if (!searchOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [searchOpen, closeSearch]);

  const visibleNav = mainNav.filter((item) => {
    if (item.id === "stats" && !showStats) return false;
    if (item.id === "subscription" && !showSubscription) return false;
    return true;
  });

  return (
    <div className="relative w-0 shrink-0 self-stretch overflow-visible lg:w-[72px]">
      <button
        type="button"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        aria-controls="callproof-sidebar-rail"
        onClick={() => setMobileOpen((o) => !o)}
        className={cn(
          "fixed left-3 top-3 z-[70] flex size-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-md",
          "outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-[#0d6efd]/40",
          "lg:hidden",
        )}
      >
        {mobileOpen ? <X className="size-5" strokeWidth={2} /> : <Menu className="size-5" strokeWidth={2} />}
      </button>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-[2px] animate-in fade-in-0 duration-200 lg:hidden"
          aria-hidden
          onClick={closeMobileMenu}
        />
      ) : null}

      <div
        id="callproof-sidebar-rail"
        className={cn(
          "fixed left-0 top-0 z-[60] h-screen shrink-0 border-r border-slate-200 bg-white transition-transform duration-200 ease-out",
          "lg:relative lg:z-40 lg:translate-x-0 lg:transition-none lg:sticky lg:top-0 lg:self-start",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        style={{ width: RAIL_W_PX }}
      >
        <aside
          className="flex h-full flex-col items-stretch justify-between py-3 text-slate-600"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="flex min-h-0 flex-1 flex-col items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/dash/rep/"
                  className="flex justify-center rounded-xl p-1 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#0d6efd]/40"
                  onClick={closeMobileMenu}
                >
                  <span className="relative block size-9 overflow-hidden rounded-sm ring-1 ring-slate-200">
                    <img src={repAvatarUrl} alt="" className="size-full object-cover" width={36} height={36} />
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Rep profile
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  id="navSearchForm"
                  aria-label="Search CallProof"
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    "mt-1 flex size-10 items-center justify-center rounded-full border border-slate-200",
                    "bg-white text-slate-600 outline-none transition-colors hover:bg-slate-50",
                    "focus-visible:ring-2 focus-visible:ring-[#0d6efd]/40",
                  )}
                >
                  <Search className="size-[18px]" strokeWidth={2} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Search CallProof
              </TooltipContent>
            </Tooltip>

            <nav className="flex w-full flex-1 flex-col items-center gap-1 px-2 pt-3" aria-label="Main">
              {visibleNav.map(({ id, label, icon: Icon }) => {
                const lit = activeNav === id || hoveredNav === id;
                return (
                  <button
                    key={id}
                    type="button"
                    ref={(el) => {
                      itemRefs.current[id] = el;
                    }}
                    className="flex w-full justify-center rounded-lg p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#0d6efd]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    aria-current={activeNav === id ? "page" : undefined}
                    aria-expanded={hoveredNav === id}
                    aria-haspopup="true"
                    aria-label={label}
                    onMouseEnter={() => openFlyout(id)}
                    onFocus={() => openFlyout(id)}
                    onClick={() => {
                      setActiveNav(id);
                      openFlyout(id);
                    }}
                  >
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full transition-colors",
                        lit ? "text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                      )}
                      style={lit ? { backgroundColor: CP_BLUE } : undefined}
                    >
                      <Icon className="size-[1.15rem]" strokeWidth={lit ? 2.25 : 2} />
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto flex flex-col items-center px-2 pb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  ref={(el) => {
                    itemRefs.current.personal = el;
                  }}
                  className="rounded-xl border border-slate-200 bg-white p-1.5 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#0d6efd]/40"
                  aria-label="Personal Settings"
                  aria-expanded={hoveredNav === "personal"}
                  aria-haspopup="true"
                  onMouseEnter={() => openFlyout("personal")}
                  onFocus={() => openFlyout("personal")}
                  onClick={() => {
                    setActiveNav("personal");
                    openFlyout("personal");
                  }}
                >
                  <span className="relative block size-8 overflow-hidden rounded-full ring-2 ring-[#0d6efd]">
                    <img src={userAvatarUrl} alt="" className="size-full object-cover" width={32} height={32} />
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Personal Settings
              </TooltipContent>
            </Tooltip>
            <div className="mt-2 flex size-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[9px] font-bold leading-tight text-slate-600">
              CRM
            </div>
          </div>

          <input type="hidden" id="defaultImage" value={DEFAULT_USER_ICON} readOnly aria-hidden />
        </aside>
      </div>

      {hoveredNav && flyoutContent ? (
        <div
          ref={flyoutRef}
          className="fixed z-[65] flex items-stretch lg:z-50"
          style={{ left: RAIL_W_PX, top: flyoutTop }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="shrink-0 bg-transparent" style={{ width: BRIDGE_W }} aria-hidden />
          <FlyoutPanel content={flyoutContent} onItemActivate={closeMobileMenu} />
        </div>
      ) : null}

      {searchOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 px-4 pt-[12vh] backdrop-blur-sm animate-in fade-in-0 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="global-search-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-elevated animate-in zoom-in-95 fade-in-0 duration-200"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="global-search-title" className="sr-only">
              Search CallProof
            </h2>
            <div className="flex h-12 items-center gap-2 border-b border-border px-3">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <label htmlFor="globalSearchInput" className="sr-only">
                Search
              </label>
              <input
                ref={inputRef}
                id="globalSearchInput"
                type="search"
                autoComplete="off"
                placeholder="Search CallProof"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close"
                onClick={closeSearch}
              >
                <X className="size-5" />
              </button>
            </div>
            <div
              id="contactSuggestionList"
              className="max-h-[min(50vh,320px)] overflow-y-auto p-2 text-sm text-muted-foreground"
              role="listbox"
              aria-label="Suggestions"
            >
              {query.trim().length === 0 ? (
                <p className="px-2 py-6 text-center">Type to search contacts and records.</p>
              ) : (
                <p className="px-2 py-6 text-center">No suggestions wired yet — hook up your search API here.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
