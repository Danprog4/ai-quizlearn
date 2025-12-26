import {
  Sparkles,
  BookOpen,
  Trophy,
  Swords,
  BarChart3,
  Flame,
  Users,
  Gift,
} from 'lucide-react'
import { FeatureCardProps } from './FeatureCard'

interface LeaderboardUser {
  id: string
  name: string
  imageUrl: string
  score: number
}

interface UserStats {
  totalScore?: number
  quizCount?: number
  streak?: number
  lastQuizDate?: string
}

export const getFeatures = (
  leaderboard: LeaderboardUser[],
  stats: UserStats | null,
  handlePickClick: (url: string) => void,
): Omit<FeatureCardProps, 'delay'>[] => [
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
      "Don't know where to start? Our Editors Pick section features the most high-quality, up-to-date documentation available. We personally verify each source to ensure the generated quizzes are accurate and challenging.",
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
