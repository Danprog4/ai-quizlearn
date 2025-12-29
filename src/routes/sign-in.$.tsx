import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'
import { Background } from '../components/home/Background'

export const Route = createFileRoute('/sign-in/$')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <Background />
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 mb-5">
              <span className="text-white/40">quizler</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Master documentation faster with focused quizzes.
            </h1>
            <p className="mt-4 text-base text-white/60 max-w-xl">
              Generate quizzes from any docs URL, track your streaks, and build
              a personalized learning path powered by AI recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Smart learning paths',
                description:
                  'AI recommendations turn weak spots into clear next lessons.',
              },
              {
                title: 'Daily streaks',
                description:
                  'Stay consistent with streak tracking and recap summaries.',
              },
              {
                title: 'Editor picks',
                description:
                  'Curated quizzes for top docs so you can start fast.',
              },
              {
                title: 'Progress analytics',
                description:
                  'See your scores, quiz counts, and recent wins in one place.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
              >
                <p className="text-sm font-semibold text-white/90">
                  {item.title}
                </p>
                <p className="text-xs text-white/50 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
            <SignIn forceRedirectUrl="/dashboard" />
          </div>
        </div>
      </div>
    </div>
  )
}
