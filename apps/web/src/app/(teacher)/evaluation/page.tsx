import { RoleGuard } from "@/components/role-guard";
import { AppShell } from "../components/app-shell";
import { MyExamsSection } from "../components/sections/my-exams-section";

export default function EvaluationPage() {
  return (
    <RoleGuard allowedRoles={["TEACHER"]}>
      <AppShell>
        <MyExamsSection mode="evaluation" />
      </AppShell>
    </RoleGuard>
  );
}
