import type { PropsWithChildren } from "react";
import { TeacherRouteShell } from "./components/teacher-route-shell";
import { RoleGuard } from "@/components/role-guard";

export default function TeacherLayout({ children }: PropsWithChildren) {
  return (
    <RoleGuard allowedRoles={["TEACHER"]}>
      <TeacherRouteShell>{children}</TeacherRouteShell>
    </RoleGuard>
  );
}
