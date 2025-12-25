import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'
import { Background } from '../components/home/Background'

export const Route = createFileRoute('/sign-in/$')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Background />
      <div className="relative z-10">
        <SignIn forceRedirectUrl="/dashboard" />
      </div>
    </div>
  )
}
