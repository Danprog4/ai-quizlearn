import { SignUp } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'
import { Background } from '~/components/home/Background'

export const Route = createFileRoute('/sign-up/$')({
  component: Page,
})

function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <Background />
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
        <div className="space-y-8 order-2 lg:order-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 mb-5">
              <span className="text-white/40">quizler</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Join the learning sprint.
            </h1>
            <p className="mt-4 text-base text-white/60 max-w-xl">
              Build a streak, unlock AI recommendations, and keep your progress
              synced across devices.
            </p>
            <p className="mt-4 text-sm text-white/50 max-w-xl">
              Building in public on Twitter. I’m 15 and sharing the whole
              journey as I learn and ship.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-white mb-3">
              What you get
            </h2>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                'Daily quizzes with clear explanations',
                'Editor picks for curated topics',
                'AI recommendations and lesson paths',
                'Progress stats across sessions',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <SignUp forceRedirectUrl="/dashboard" />
          </div>
        </div>
      </div>
    </div>
  )
}
