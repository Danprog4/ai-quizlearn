import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { UserButton } from '@clerk/tanstack-react-start'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Trophy,
  Users,
  Flame,
  BookOpen,
  Target,
  Zap,
  Crown,
  BarChart3,
  Swords,
  Gift,
  Bell,
  X,
} from 'lucide-react'
import { Background } from '../components/home/Background'
import { useNavigate } from '@tanstack/react-router'

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    throw redirect({
      to: '/sign-in/$',
    })
  }

  return { userId }
})

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => {
    return { userId: context.userId }
  },
})

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  accentColor: string
  delay: number
  preview?: React.ReactNode
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  accentColor,
  delay,
  preview,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="relative group"
    >
      <div
        className={`relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm overflow-hidden h-full transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20`}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 ${gradient} opacity-50`} />

        {/* Coming soon badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
          <X size={10} className="text-white/60" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
            Soon
          </span>
        </div>

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
            <div className="mt-4 opacity-40 pointer-events-none">{preview}</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function Dashboard() {
  const features: Omit<FeatureCardProps, 'delay'>[] = [
    {
      icon: <Sparkles className="w-6 h-6 text-violet-400" />,
      title: 'AI Recommendations',
      description:
        'Personalized learning paths based on your quiz performance and interests. The AI analyzes your strengths and suggests what to learn next.',
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
      description:
        'Curated quizzes handpicked by our team. From trending tech topics to timeless fundamentals — always something fresh to explore.',
      gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
      accentColor: 'bg-emerald-500/20',
      preview: (
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-white/5 text-center">
              <div className="w-full h-8 rounded bg-emerald-500/10 mb-2" />
              <div className="h-2 bg-white/10 rounded w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: 'Global Leaderboard',
      description:
        'Compete with learners worldwide. Climb the ranks, earn badges, and see how you stack up against the best.',
      gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
      accentColor: 'bg-amber-500/20',
      preview: (
        <div className="space-y-2">
          {[
            { rank: 1, color: 'text-amber-400' },
            { rank: 2, color: 'text-gray-400' },
            { rank: 3, color: 'text-orange-400' },
          ].map(({ rank, color }) => (
            <div
              key={rank}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
            >
              <span className={`w-6 text-center text-xs font-bold ${color}`}>
                #{rank}
              </span>
              <div className="w-6 h-6 rounded-full bg-white/20" />
              <div className="h-2.5 bg-white/10 rounded flex-1" />
              <span className="text-[10px] text-white/30">1,234 pts</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <Swords className="w-6 h-6 text-rose-400" />,
      title: 'Live Competitions',
      description:
        'Join real-time quiz battles. Challenge friends or random opponents and prove your knowledge in head-to-head matches.',
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
      description:
        'Deep insights into your learning journey. Track progress, identify weak areas, and celebrate your wins.',
      gradient: 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10',
      accentColor: 'bg-cyan-500/20',
      preview: (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Quizzes', value: '42' },
            { label: 'Accuracy', value: '87%' },
            { label: 'Streak', value: '7d' },
          ].map(({ label, value }) => (
            <div key={label} className="p-2 rounded-lg bg-white/5 text-center">
              <div className="text-sm font-bold text-white/20">{value}</div>
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
        'Build a learning habit. Maintain your streak, unlock rewards, and never break the chain!',
      gradient: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
      accentColor: 'bg-orange-500/20',
      preview: (
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                day <= 5 ? 'bg-orange-500/30' : 'bg-white/5'
              }`}
            >
              {day <= 5 ? (
                <Flame size={12} className="text-orange-400/60" />
              ) : (
                <span className="text-[10px] text-white/20">{day}</span>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: 'Study Groups',
      description:
        'Learn together with friends. Create private groups, share quizzes, and motivate each other.',
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
      description:
        'Earn achievements for your milestones. Collect badges, unlock special quizzes, and show off your accomplishments.',
      gradient: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
      accentColor: 'bg-pink-500/20',
      preview: (
        <div className="flex items-center justify-center gap-2">
          {['🏆', '⭐', '🎯', '🔥', '💎'].map((emoji, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm"
            >
              {emoji}
            </div>
          ))}
        </div>
      ),
    },
  ]

  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-indigo-500/30">
      <Background />

      <header className="w-full max-w-7xl px-6 py-6 md:py-8 flex justify-between items-center z-10">
        <button
          onClick={() => navigate({ to: '/' })}
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
              I'm building something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                amazing
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Your learning journey is about to level up. Here's a sneak peek at
              what's coming to make your experience even better.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={0.1 * index}
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
                We're working hard to bring these features to you. In the
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
