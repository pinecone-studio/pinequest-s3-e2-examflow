import { AppShell } from "./components/app-shell";
import { DashboardContent } from "./components/dashboard-content";
import { RoleGuard } from "@/components/role-guard";

export default function Home() {
  return (
    <RoleGuard allowedRoles={["TEACHER"]}>
      <AppShell contentClassName="!px-0 !py-0 sm:!px-0 sm:!py-0 lg:!px-0 lg:!py-0">
        <DashboardContent />
      </AppShell>
    </RoleGuard>
  );
}
