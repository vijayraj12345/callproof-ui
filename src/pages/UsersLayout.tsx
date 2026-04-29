import { Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";

const UsersLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default UsersLayout;
