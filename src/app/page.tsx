import { ProtectedContent } from '@/components/protected-content'
import { CodePresentation } from './_components/code-presentation/code-presentation'


export default async function Home() {
  return(
    <div className="h-full p-4 lg:p-6">
      <ProtectedContent />
      <CodePresentation />
    </div>
  )
}