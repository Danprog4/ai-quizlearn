import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { UserButton } from '@clerk/tanstack-react-start'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Crown, Bell, Target } from 'lucide-react'
import { Background } from '../components/home/Background'
import { useNavigate } from '@tanstack/react-router'
import { getLeaderboard, getUserStats } from '../server/main/main'
import {
  FeatureCard,
  FeatureCardProps,
} from '../components/dashboard/FeatureCard'
import { FeatureModal } from '../components/dashboard/FeatureModal'
import { getFeatures } from '../components/dashboard/FeatureData'

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    throw redirect({
      to: '/sign-in/$',
    })
  }

  const [leaderboard, stats] = await Promise.all([
    getLeaderboard(),
    getUserStats(),
  ])

  return { userId, leaderboard, stats }
})

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => {
    return {
      userId: context.userId,
      leaderboard: context.leaderboard,
      stats: context.stats,
    }
  },
})

function Dashboard() {
  const navigate = useNavigate()
  const { leaderboard, stats } = Route.useLoaderData()
  const [selectedFeature, setSelectedFeature] = useState<Omit<
    FeatureCardProps,
    'delay'
  > | null>(null)

  const handlePickClick = (url: string) => {
    navigate({
      to: '/',
      search: { url: undefined },
    })
    // Small timeout to allow navigation to start before pushing the search param if needed
    // Actually TanStack Router is better with absolute objects
    navigate({
      to: '/',
      search: { url },
    })
  }

  const features = getFeatures(leaderboard, stats, handlePickClick)

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-indigo-500/30">
      <Background />

      <AnimatePresence>
        {selectedFeature && (
          <FeatureModal
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </AnimatePresence>

      <header className="w-full max-w-7xl px-6 py-6 md:py-8 flex justify-between items-center z-10">
        <button
          onClick={() => navigate({ to: '/', search: { url: undefined } })}
          className="text-lg md:text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          ai<span className="text-white/40">quiz</span>
        </button>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-white/70">
          <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Build in public • MVP
        </div>
        <UserButton />
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Bell size={14} className="text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">
                Welcome to your dashboard
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              I&apos;m building something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                amazing
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Your learning journey is about to level up. Here&apos;s a sneak
              peek at what&apos;s coming to make your experience even better.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={0.1 * index}
                onClick={() => setSelectedFeature(feature)}
              />
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <Crown className="w-10 h-10 text-amber-400" />
              <h2 className="text-xl font-bold text-white">
                Stay tuned for updates!
              </h2>
              <p className="text-sm text-white/50 max-w-md">
                We&apos;re working hard to bring these features to you. In the
                meantime, keep learning with our quiz generator!
              </p>
              <a
                href="/"
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2"
              >
                <Target size={16} />
                Take a Quiz
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-white/30">
            © 2025 QuizLearn. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
