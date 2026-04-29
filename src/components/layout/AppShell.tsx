import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";

export type AppShellVariant = "standard" | "dashboard";

export type AppShellProps = {
  children: ReactNode;
  /** `dashboard` = full viewport height home shell (scroll inside main). */
  variant?: AppShellVariant;
  className?: string;
  mainClassName?: string;
};

const mainStandard =
  "flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-hidden px-3 pb-4 pt-14 sm:px-4 md:px-5 md:pb-5 lg:px-6 lg:pt-5 lg:pb-5 xl:px-8";

/**
 * Shared app chrome: sidebar rail + main region with consistent responsive padding.
 * Mobile: extra top padding clears the fixed hamburger (lg:hidden in Sidebar).
 */
export function AppShell({ children, variant = "standard", className, mainClassName }: AppShellProps) {
  if (variant === "dashboard") {
    return (
      <div
        className={cn(
          "flex h-[100dvh] min-h-0 w-full max-w-[100vw] overflow-hidden bg-[#f4f6f9]",
          className,
        )}
      >
        <Sidebar />
        <main
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden",
            mainClassName,
          )}
        >
          {children}
        </main>
      </div>
    );
  }

  return (
    <div
      className={cn("flex min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-background", className)}
    >
      <Sidebar />
      <main className={cn(mainStandard, mainClassName)}>{children}</main>
    </div>
  );
}
