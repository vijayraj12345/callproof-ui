import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Welcome back!", description: "Signed in successfully." });
    }, 900);
  };

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full gradient-primary opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full gradient-accent opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-72 h-72 rounded-full gradient-info opacity-20 blur-3xl" />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-elevated border border-border/60 bg-card/80 backdrop-blur-xl animate-slide-up">
        {/* Left: Brand panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 gradient-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              CallProof CRM
            </div>
            <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight">
              Welcome back.<br />Let's close more deals.
            </h1>
            <p className="mt-4 text-primary-foreground/80 text-base max-w-sm">
              Track calls, manage routes and crush your goals — all in one beautifully simple dashboard.
            </p>
          </div>

          <div className="relative space-y-3">
            {[
              "Real-time team performance",
              "Smart route planning & maps",
              "AI insights that drive action",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                {t}
              </div>
            ))}
          </div>

          <div className="relative flex items-center gap-3 text-xs text-primary-foreground/70">
            <div className="flex -space-x-2">
              {["bg-accent", "bg-info", "bg-success"].map((c, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} ring-2 ring-white/40`} />
              ))}
            </div>
            Trusted by 12,000+ sales teams worldwide
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-8 sm:p-10 lg:p-12 bg-card">
          <div className="max-w-sm mx-auto w-full">
            <div className="lg:hidden mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full gradient-primary text-primary-foreground text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              CallProof CRM
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-foreground">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access your dashboard.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-smooth" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="pl-10 h-12 rounded-xl border-border/70 bg-background/60 focus-visible:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link to="#" className="text-xs font-medium text-primary hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-smooth" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 rounded-xl border-border/70 bg-background/60 focus-visible:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <Checkbox id="remember" />
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-95 transition-smooth group"
              >
                {loading ? "Signing in..." : (
                  <span className="inline-flex items-center gap-2">
                    Sign in
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-smooth" />
                  </span>
                )}
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="h-11 rounded-xl border-border/70 hover:bg-secondary">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
                  Google
                </Button>
                <Button type="button" variant="outline" className="h-11 rounded-xl border-border/70 hover:bg-secondary">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.55-.12-1.06.396-2.18 1.058-2.95.74-.86 2.02-1.51 3.106-1.68zM20.13 17.32c-.59 1.36-.872 1.97-1.63 3.18-1.06 1.69-2.55 3.79-4.4 3.81-1.64.02-2.06-1.07-4.28-1.06-2.22.01-2.69 1.08-4.33 1.06-1.85-.02-3.27-1.92-4.32-3.6-2.96-4.7-3.27-10.22-1.44-13.16C1.05 5.46 3.18 4.18 5.18 4.18c2.07 0 3.37 1.13 5.08 1.13 1.66 0 2.67-1.13 5.07-1.13 1.81 0 3.74.99 5.11 2.7-4.49 2.46-3.76 8.87-.31 10.44z"/></svg>
                  Apple
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground pt-2">
                Don't have an account?{" "}
                <Link to="#" className="font-semibold text-primary hover:underline">Create one</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
