import { Sidebar } from "../components/sidebar";
import { CreateExamContent } from "./create-exam-content";

export default function CreateExamPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="flex min-h-screen flex-col overflow-hidden lg:h-screen lg:flex-row">
        <Sidebar />
        <section className="flex-1 overflow-y-auto">
          <CreateExamContent />
        </section>
      </div>
    </main>
  );
}
