import { AppShell } from "@/app/components/app-shell";
import { ClassDetailPageContent } from "./class-detail-page-content";

export const runtime = "edge";

type ClassDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClassDetailPage({
  params,
}: ClassDetailPageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <ClassDetailPageContent id={id} />
    </AppShell>
  );
}
