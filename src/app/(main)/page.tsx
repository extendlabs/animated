import { CodePresentation } from "./_components/code-presentation/code-presentation";
import { EditButton } from "./_components/edit-button";

export default async function Home() {
  return (
    <div className="p-4 lg:p-6">
      <div className="flex gap-2">
        <EditButton />
      </div>
      <CodePresentation />
    </div>
  );
}
