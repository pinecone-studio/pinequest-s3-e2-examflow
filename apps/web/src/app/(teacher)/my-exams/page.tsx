import { AppShell } from "../components/app-shell";
import { MyExamsSection } from "../components/sections/my-exams-section";
import { RoleGuard } from "@/components/role-guard";

export default function MyExamsPage() {
  return (
    <RoleGuard allowedRoles={["TEACHER"]}>
      <AppShell
        contentOuterClassName="flex w-full justify-center"
        contentInnerClassName="w-[1184px]"
        contentClassName="px-0 py-0"
      >
        <MyExamsSection />
      </AppShell>
    </RoleGuard>
  );
}
