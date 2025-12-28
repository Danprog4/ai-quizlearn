import { PricingTable } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle2,
  Crown,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Background } from '../components/home/Background'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

function PricingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080808]">
      <Background />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-15%] left-[-5%] h-[360px] w-[360px] rounded-full bg-indigo-500/15 blur-[140px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 mb-5">
            <Sparkles size={14} className="text-emerald-400" />
            Pricing that grows with your learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Modern plans for focused learners
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Start free and unlock Pro when you want structured AI learning
            paths, deeper insights, and higher daily limits.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/50">
            <span className="inline-flex items-center gap-2">
              <Shield size={14} className="text-emerald-400" />
              Secure checkout
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap size={14} className="text-indigo-400" />
              Instant unlocks
            </span>
            <span className="inline-flex items-center gap-2">
              <Crown size={14} className="text-amber-400" />
              Cancel anytime
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              title: 'AI-powered learning',
              description:
                'Get adaptive recommendations and lesson quizzes built for your goals.',
              icon: <Sparkles size={18} className="text-emerald-300" />,
            },
            {
              title: 'Progress clarity',
              description:
                'Track streaks, scores, and recent lessons in a single view.',
              icon: <CheckCircle2 size={18} className="text-indigo-300" />,
            },
            {
              title: 'Premium access',
              description:
                'Unlock Pro-only editor picks and higher daily quiz limits.',
              icon: <Crown size={18} className="text-amber-300" />,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 text-white/80 font-semibold mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  {item.icon}
                </span>
                {item.title}
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Plans
                </p>
                <h2 className="text-xl font-bold text-white">
                  Choose your plan
                </h2>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
                Live
              </div>
            </div>
            <PricingTable newSubscriptionRedirectUrl="/dashboard" />
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">
                Pro includes
              </h3>
              <ul className="space-y-3 text-sm text-white/60">
                {[
                  'Unlimited AI recommendations and lesson paths',
                  'Editor picks and curated quizzes',
                  'Higher daily quiz limits',
                  'Priority model performance',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-3">FAQ</h3>
              <div className="space-y-4 text-sm text-white/60">
                <div>
                  <p className="text-white/80 font-semibold mb-1">
                    Can I cancel anytime?
                  </p>
                  <p>You can cancel right from your billing portal.</p>
                </div>
                <div>
                  <p className="text-white/80 font-semibold mb-1">
                    Do I keep my progress?
                  </p>
                  <p>Your streaks and stats stay with you on any plan.</p>
                </div>
                <div>
                  <p className="text-white/80 font-semibold mb-1">
                    Is the free plan limited?
                  </p>
                  <p>Free users get daily quizzes with core features.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
