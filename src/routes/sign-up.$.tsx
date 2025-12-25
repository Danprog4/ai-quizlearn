import { SignUp } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'
import { Background } from '~/components/home/Background'

export const Route = createFileRoute('/sign-up/$')({
  component: Page,
})

function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Background />
      <div className="relative z-10">
        <SignUp forceRedirectUrl="/dashboard" />
      </div>
    </div>
  )
}
