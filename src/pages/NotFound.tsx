import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden bg-muted px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">Error</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground xs:text-4xl">404</h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">This page does not exist or was moved.</p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
