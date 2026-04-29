import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import {
  getRepById,
  repDisplayName,
  type CompanyRep,
} from "@/data/companyDirectorySampleData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function CompanyDirectoryRepView() {
  const { repId } = useParams<{ repId: string }>();
  const navigate = useNavigate();
  const base = useMemo(() => (repId ? getRepById(repId) : undefined), [repId]);

  const [rep, setRep] = useState<CompanyRep | null>(base ?? null);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const next = repId ? getRepById(repId) : undefined;
    setRep(next ?? null);
  }, [repId]);

  if (!repId || !rep) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">Rep not found.</p>
        <Button asChild variant="outline">
          <Link to="/users">Back to Company Directory</Link>
        </Button>
      </div>
    );
  }

  const name = repDisplayName(rep);

  const setAccess = (id: string, enabled: boolean) => {
    setRep((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        userAccess: prev.userAccess.map((t) => (t.id === id ? { ...t, enabled } : t)),
      };
    });
  };

  const save = () => {
    toast.success("Rep saved (demo)");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto">
      <header className="relative overflow-hidden rounded-2xl border border-primary/15 p-4 shadow-soft sm:p-5">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-violet-500/[0.07] to-accent/[0.12]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent dark:via-white/[0.05]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <nav className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
              <Link to="/users" className="font-medium text-primary underline-offset-2 hover:underline">
                Company Directory
              </Link>
              <span aria-hidden className="text-muted-foreground/70">
                &gt;&gt;
              </span>
              <span className="truncate font-semibold text-foreground">{name}</span>
            </nav>
            <p className="text-xs text-muted-foreground">Edit profile, access, and Twilio settings.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button className="gradient-primary text-primary-foreground shadow-glow" onClick={save}>
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/25">
                  Quick Links
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/users")}>Back to directory</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.message("Opening phone numbers")}>My phone numbers</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.message("Opening markets")}>Markets &amp; territories</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Card className="border-border shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Role</CardTitle>
          <CardDescription>Manager capabilities for this rep.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/80 bg-muted/30 px-4 py-3">
            <Label htmlFor="is-manager" className="text-sm font-medium">
              Is a manager
            </Label>
            <Switch
              id="is-manager"
              checked={rep.isManager}
              onCheckedChange={(v) => setRep((p) => (p ? { ...p, isManager: v } : p))}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">User access</CardTitle>
          <CardDescription>Toggle permissions to match your org policy.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {rep.userAccess.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-card px-3 py-2.5"
              >
                <span className="text-xs font-medium leading-snug text-foreground">{t.label}</span>
                <Switch checked={t.enabled} onCheckedChange={(v) => setAccess(t.id, v)} aria-label={t.label} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">User details</CardTitle>
            <CardDescription>Address and opportunity visibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="addr">Address</Label>
              <Input id="addr" value={rep.address} onChange={(e) => setRep((p) => (p ? { ...p, address: e.target.value } : p))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addr2">Address 2</Label>
              <Input id="addr2" value={rep.address2} onChange={(e) => setRep((p) => (p ? { ...p, address2: e.target.value } : p))} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={rep.city} onChange={(e) => setRep((p) => (p ? { ...p, city: e.target.value } : p))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip">Zip code</Label>
                <Input id="zip" value={rep.zip} onChange={(e) => setRep((p) => (p ? { ...p, zip: e.target.value } : p))} />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>State</Label>
                <Select value={rep.state} onValueChange={(v) => setRep((p) => (p ? { ...p, state: v } : p))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={rep.state}>{rep.state}</SelectItem>
                    <SelectItem value="TN">TN</SelectItem>
                    <SelectItem value="TX">TX</SelectItem>
                    <SelectItem value="CA">CA</SelectItem>
                    <SelectItem value="ON">ON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Country</Label>
                <Select value={rep.country} onValueChange={(v) => setRep((p) => (p ? { ...p, country: v } : p))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  className="font-mono tabular-nums"
                  value={String(rep.lat)}
                  onChange={(e) => setRep((p) => (p ? { ...p, lat: Number(e.target.value) || 0 } : p))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  className="font-mono tabular-nums"
                  value={String(rep.lng)}
                  onChange={(e) => setRep((p) => (p ? { ...p, lng: Number(e.target.value) || 0 } : p))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Places category</Label>
              <Select value={rep.placesCategory} onValueChange={(v) => setRep((p) => (p ? { ...p, placesCategory: v } : p))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Field">Field</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border/80 bg-muted/30 px-4 py-3">
              <Label htmlFor="view-opps" className="text-sm font-medium">
                Can view others&apos; opportunities
              </Label>
              <Switch
                id="view-opps"
                checked={rep.canViewOthersOpportunities}
                onCheckedChange={(v) => setRep((p) => (p ? { ...p, canViewOthersOpportunities: v } : p))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Opportunity stages to view</Label>
              <div className="flex min-h-10 flex-wrap gap-1 rounded-md border border-input bg-background px-2 py-2">
                {rep.opportunityStages.length === 0 ? (
                  <span className="text-xs text-muted-foreground">None selected</span>
                ) : (
                  rep.opportunityStages.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">
                      {s}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Twilio settings &amp; management</CardTitle>
            <CardDescription>Caller ID, radius, and market scope.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Label>Message caller ID</Label>
              <Select value={rep.messageCallerId} onValueChange={(v) => setRep((p) => (p ? { ...p, messageCallerId: v } : p))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={rep.messageCallerId}>{rep.messageCallerId}</SelectItem>
                  <SelectItem value="CP Main">CP Main</SelectItem>
                  <SelectItem value="Regional">Regional pool</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Title</Label>
              <Select value={rep.title} onValueChange={(v) => setRep((p) => (p ? { ...p, title: v } : p))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Sales Rep">Sales rep</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Account radius</Label>
              <Select value={rep.accountRadius} onValueChange={(v) => setRep((p) => (p ? { ...p, accountRadius: v } : p))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25 mi">25 mi</SelectItem>
                  <SelectItem value="30 mi">30 mi</SelectItem>
                  <SelectItem value="40 mi">40 mi</SelectItem>
                  <SelectItem value="50 mi">50 mi</SelectItem>
                  <SelectItem value="60 mi">60 mi</SelectItem>
                  <SelectItem value="75 mi">75 mi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Appointment button assignment</Label>
              <Select
                value={rep.appointmentButtonAssignment}
                onValueChange={(v) => setRep((p) => (p ? { ...p, appointmentButtonAssignment: v } : p))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Self">Self</SelectItem>
                  <SelectItem value="Round-robin">Round-robin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Default phone</Label>
              <Select value={rep.defaultPhone} onValueChange={(v) => setRep((p) => (p ? { ...p, defaultPhone: v } : p))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rep.phones.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" variant="link" className="h-auto p-0 text-sm">
              Add / edit phone
            </Button>
            <div className="grid gap-2">
              <Label>Market list</Label>
              <div className="flex flex-wrap gap-1 rounded-md border border-input bg-background px-2 py-2">
                {rep.markets.map((m) => (
                  <Badge key={m} variant="outline" className="border-primary/25 text-[10px]">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-border/80 bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-between gap-4 sm:justify-start">
                <Label htmlFor="mm" className="text-sm font-medium">
                  Market manager
                </Label>
                <Switch id="mm" checked={rep.marketManager} onCheckedChange={(v) => setRep((p) => (p ? { ...p, marketManager: v } : p))} />
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-start">
                <Label htmlFor="lm" className="text-sm font-medium">
                  Limit to market (events)
                </Label>
                <Switch id="lm" checked={rep.limitToMarket} onCheckedChange={(v) => setRep((p) => (p ? { ...p, limitToMarket: v } : p))} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Rep</CardTitle>
          <CardDescription>Identity, sign-in, and profile image.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="fn">First name</Label>
                <Input id="fn" value={rep.firstName} onChange={(e) => setRep((p) => (p ? { ...p, firstName: e.target.value } : p))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ln">Last name</Label>
                <Input id="ln" value={rep.lastName} onChange={(e) => setRep((p) => (p ? { ...p, lastName: e.target.value } : p))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="em">Email</Label>
                <Input id="em" type="email" value={rep.email} onChange={(e) => setRep((p) => (p ? { ...p, email: e.target.value } : p))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pw">Password</Label>
                <div className="relative">
                  <Input
                    id="pw"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 size-9 text-muted-foreground"
                    aria-label={showPw ? "Hide password" : "Show password"}
                    onClick={() => setShowPw((s) => !s)}
                  >
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pw2">Confirm password</Label>
                <Input id="pw2" type={showPw ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Profile image</Label>
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6">
                <div className="flex size-24 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                  No photo
                </div>
                <p className="text-center text-[11px] text-muted-foreground">Use a square image for best results.</p>
                <div className="w-full rounded-lg border border-dashed border-border bg-background/80 px-3 py-6 text-center text-xs text-muted-foreground">
                  Drag &amp; drop or choose a file
                </div>
                <Button type="button" variant="secondary" size="sm">
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
