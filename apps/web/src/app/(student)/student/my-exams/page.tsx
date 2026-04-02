import { RoleGuard } from "@/components/role-guard";
import { StudentMyExamsContent } from "../../components/student-my-exams-content";
import { StudentShell } from "../../components/student-shell";

export default function StudentMyExamsPage() {
  return (
    <RoleGuard allowedRoles={["STUDENT"]}>
      <StudentShell>
        <StudentMyExamsContent />
      </StudentShell>
    </RoleGuard>
  );
}
