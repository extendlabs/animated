import CodePresentation from "@/components/code-presentation";
import { slides_02 } from "@/constants/slides";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <CodePresentation slides={slides_02} />
    </main>
  );
}
