import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { UserButton } from '@clerk/tanstack-react-start'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Sparkles,
  Trophy,
  Users,
  Flame,
  BookOpen,
  Target,
  Crown,
  BarChart3,
  Swords,
  Gift,
  Bell,
  X,
  ChevronRight,
} from 'lucide-react'
import { Background } from '../components/home/Background'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '../lib/utils'
import { getLeaderboard, getUserStats } from '../server/main/main'

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

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  longDescription?: string
  gradient: string
  accentColor: string
  delay: number
  preview?: React.ReactNode
  isComingSoon?: boolean
  onClick?: () => void
}

function FeatureModal({
  feature,
  onClose,
}: {
  feature: Omit<FeatureCardProps, 'delay'> | null
  onClose: () => void
}) {
  if (!feature) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080808]/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-32 relative ${feature.gradient} opacity-50`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors z-20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 -mt-12 relative z-10">
          <div
            className={`w-16 h-16 rounded-2xl ${feature.accentColor} flex items-center justify-center mb-6 shadow-xl`}
          >
            {feature.icon}
          </div>

          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">{feature.title}</h2>
            {feature.isComingSoon && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/40">
                Soon
              </span>
            )}
          </div>

          <p className="text-white/60 leading-relaxed mb-8">
            {feature.longDescription || feature.description}
          </p>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
              <Sparkles size={12} className="text-indigo-400" />
              Preview Interaction
            </h4>
            <div className="opacity-80">{feature.preview}</div>
          </div>

          <button
            onClick={onClose}
            className={`w-full mt-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all flex items-center justify-center gap-2`}
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  accentColor,
  delay,
  preview,
  isComingSoon = true,
  onClick,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={cn('relative group cursor-pointer')}
      onClick={onClick}
    >
      <div
        className={cn(
          'relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm overflow-hidden h-full transition-all duration-300',
          'group-hover:bg-white/[0.08] group-hover:border-white/20',
        )}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 ${gradient} opacity-50`} />

        {/* Coming soon badge */}
        {isComingSoon && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
            <X size={10} className="text-white/60" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              Soon
            </span>
          </div>
        )}

        {!isComingSoon && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <ChevronRight size={14} className="text-white/40" />
            </div>
          </div>
        )}

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-xl ${accentColor} flex items-center justify-center`}
            >
              {icon}
            </div>
            <h3 className="font-bold text-white text-lg">{title}</h3>
          </div>
          <p className="text-sm text-white/50 leading-relaxed mb-4">
            {description}
          </p>
          {preview && (
            <div
              className={cn(
                'mt-4 transition-opacity',
                isComingSoon ? 'opacity-40 pointer-events-none' : 'opacity-100',
              )}
            >
              {preview}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

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
      search: { url },
    })
  }

  const features: Omit<FeatureCardProps, 'delay'>[] = [
    {
      icon: <Sparkles className="w-6 h-6 text-violet-400" />,
      title: 'AI Recommendations',
      description:
        'Personalized learning paths based on your quiz performance and interests.',
      longDescription:
        'Our AI analyzes your quiz results to identify specific topics where you struggle. It then builds a customized curriculum, pulling in relevant documentation to help you master those areas systematically.',
      gradient: 'bg-gradient-to-br from-violet-500/10 to-purple-500/10',
      accentColor: 'bg-violet-500/20',
      preview: (
        <div className="space-y-2">
          {['React Hooks Deep Dive', 'TypeScript Generics', 'Next.js 14'].map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-500/20" />
                <div className="h-2.5 bg-white/10 rounded flex-1" />
              </div>
            ),
          )}
        </div>
      ),
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      title: "Editor's Picks",
      description: 'Curated quizzes handpicked by our team of experts.',
      longDescription:
        'Dont know where to start? Our Editors Pick section features the most high-quality, up-to-date documentation available. We personally verify each source to ensure the generated quizzes are accurate and challenging.',
      gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
      accentColor: 'bg-emerald-500/20',
      isComingSoon: false,
      preview: (
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'React', url: 'https://react.dev' },
            { name: 'TypeScript', url: 'https://www.typescriptlang.org/docs/' },
            { name: 'Tailwind', url: 'https://tailwindcss.com/docs' },
            { name: 'TanStack', url: 'https://tanstack.com/query/latest/docs' },
          ].map((pick) => (
            <button
              key={pick.name}
              onClick={(e) => {
                e.stopPropagation()
                handlePickClick(pick.url)
              }}
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center group/pick"
            >
              <div className="w-full h-8 rounded bg-emerald-500/10 mb-2 flex items-center justify-center group-hover/pick:bg-emerald-500/20 transition-colors">
                <BookOpen size={14} className="text-emerald-400/40" />
              </div>
              <div className="text-[10px] font-bold text-white/60 group-hover/pick:text-white transition-colors">
                {pick.name}
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: 'Global Leaderboard',
      description: 'Compete with learners worldwide and climb the ranks.',
      longDescription:
        'Every correct answer earns you 10 points. Climb the global leaderboard to showcase your knowledge. We reset the monthly rankings periodically, so there is always a chance at the #1 spot!',
      gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
      accentColor: 'bg-amber-500/20',
      isComingSoon: false,
      preview: (
        <div className="space-y-2">
          {leaderboard.map(
            (
              user: {
                id: string
                name: string
                imageUrl: string
                score: number
              },
              index: number,
            ) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
              >
                <span
                  className={`w-6 text-center text-xs font-bold ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-white/20'}`}
                >
                  #{index + 1}
                </span>
                <img
                  src={user.imageUrl}
                  className="w-6 h-6 rounded-full border border-white/10"
                  alt=""
                />
                <div className="text-[10px] text-white/70 font-medium truncate flex-1">
                  {user.name}
                </div>
                <span className="text-[10px] text-white/30 truncate">
                  {user.score} pts
                </span>
              </div>
            ),
          )}
        </div>
      ),
    },
    {
      icon: <Swords className="w-6 h-6 text-rose-400" />,
      title: 'Live Competitions',
      description:
        'Join real-time quiz battles. Challenge friends or random opponents.',
      longDescription:
        'Experience the thrill of head-to-head learning. Match with an opponent in real-time, answer the same questions, and see who finishes faster with higher accuracy. Winner takes a portion of the losers rank points!',
      gradient: 'bg-gradient-to-br from-rose-500/10 to-pink-500/10',
      accentColor: 'bg-rose-500/20',
      preview: (
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20" />
            <div className="h-2 bg-white/10 rounded w-16" />
          </div>
          <span className="text-white/30 text-xs font-bold">VS</span>
          <div className="flex items-center gap-2">
            <div className="h-2 bg-white/10 rounded w-16" />
            <div className="w-8 h-8 rounded-full bg-rose-500/20" />
          </div>
        </div>
      ),
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-cyan-400" />,
      title: 'Learning Analytics',
      description: 'Deep insights into your learning journey and wins.',
      longDescription:
        'Beyond just scores, we track your performance per technology. Identify whether you need to brush up on React state management or CSS layout through our detailed historical charts.',
      gradient: 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10',
      accentColor: 'bg-cyan-500/20',
      isComingSoon: false,
      preview: (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Points', value: stats?.totalScore || 0 },
            { label: 'Quizzes', value: stats?.quizCount || 0 },
            { label: 'Streak', value: `${stats?.streak || 0}d` },
          ].map(({ label, value }) => (
            <div key={label} className="p-2 rounded-lg bg-white/5 text-center">
              <div className="text-sm font-bold text-white/70">{value}</div>
              <div className="text-[8px] text-white/30 uppercase">{label}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <Flame className="w-6 h-6 text-orange-400" />,
      title: 'Daily Streaks',
      description:
        'Build a learning habit. Maintain your streak, unlock rewards.',
      longDescription:
        'Consistency is the most powerful tool for learning. Complete just one quiz every day to keep your streak alive. High streaks unlock special avatar frames and bonus point multipliers!',
      gradient: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
      accentColor: 'bg-orange-500/20',
      isComingSoon: false,
      preview: (
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const currentStreak = stats?.streak || 0
            const isActive = day <= currentStreak
            return (
              <div
                key={day}
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${isActive ? 'bg-orange-500/30' : 'bg-white/5'}`}
              >
                {isActive ? (
                  <Flame size={12} className="text-orange-400" />
                ) : (
                  <span className="text-[10px] text-white/20">{day}</span>
                )}
              </div>
            )
          })}
        </div>
      ),
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: 'Study Groups',
      description: 'Learn together with friends. Create private groups.',
      longDescription:
        'Learning is better social. Create a private group for your company or university class, share custom docs URLs, and maintain a private leaderboard to foster healthy competition.',
      gradient: 'bg-gradient-to-br from-indigo-500/10 to-violet-500/10',
      accentColor: 'bg-indigo-500/20',
      preview: (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-indigo-500/30 border-2 border-[#080808]"
              />
            ))}
          </div>
          <span className="text-[10px] text-white/30">+12 members</span>
        </div>
      ),
    },
    {
      icon: <Gift className="w-6 h-6 text-pink-400" />,
      title: 'Rewards & Badges',
      description: 'Earn achievements for your milestones and collect medals.',
      longDescription:
        'Collect unique badges as you reach milestones like reaching 500 points, maintaining a 30-day streak, or getting 100% accuracy on advanced quizzes. Some badges even unlock early access to new AI models!',
      gradient: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
      accentColor: 'bg-pink-500/20',
      isComingSoon: false,
      preview: (
        <div className="flex items-center justify-center gap-2">
          {[
            { emoji: '🏆', minScore: 100 },
            { emoji: '⭐', minScore: 50 },
            { emoji: '🎯', minScore: 200 },
            { emoji: '🔥', minScore: 10 },
            { emoji: '💎', minScore: 500 },
          ].map((badge) => {
            const hasBadge = (stats?.totalScore || 0) >= badge.minScore
            return (
              <div
                key={badge.emoji}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${hasBadge ? 'bg-indigo-500/30 grayscale-0 opacity-100' : 'bg-white/5 grayscale opacity-20'}`}
                title={hasBadge ? 'Unlocked' : `Requires ${badge.minScore} pts`}
              >
                {badge.emoji}
              </div>
            )
          })}
        </div>
      ),
    },
  ]

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
