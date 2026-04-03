import type { PropsWithChildren } from "react";
import { RoleGuard } from "@/components/role-guard";
import { StudentShell } from "../components/student-shell";

export default function StudentLayout({ children }: PropsWithChildren) {
  return (
    <RoleGuard allowedRoles={["STUDENT"]}>
      <StudentShell>{children}</StudentShell>
    </RoleGuard>
  );
}
