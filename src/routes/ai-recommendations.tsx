import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { UserButton } from '@clerk/tanstack-react-start'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Sparkles,
  Layout,
  BookOpen,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { Background } from '../components/home/Background'
import { getRecommendations, type Recommendation } from '../server/main/main'
import { fetchRecommendationsCached } from '../lib/recommendations'
import { useEffect, useState } from 'react'
import { Protect } from '@clerk/tanstack-react-start'

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    throw redirect({
      to: '/sign-in/$',
    })
  }

  return { isAuthenticated }
})

export const Route = createFileRoute('/ai-recommendations')({
  component: AiRecommendations,
  beforeLoad: async () => await authStateFn(),
})

function AiRecommendations() {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isIndex = pathname === '/ai-recommendations'

  useEffect(() => {
    if (!isIndex) {
      return
    }

    setLoading(true)
    fetchRecommendationsCached(getRecommendations)
      .then((data) => {
        setRecommendations(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch recommendations:', err)
        setLoading(false)
      })
  }, [isIndex])

  if (!isIndex) {
    return <Outlet />
  }

  return (
    <Protect>
      <div className="relative min-h-screen flex flex-col selection:bg-indigo-500/30">
        <Background />

        <header className="w-full max-w-7xl px-6 py-6 md:py-8 flex justify-between items-center z-10 mx-auto">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <UserButton />
        </header>

        <main className="flex-1 relative z-10">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Sparkles className="w-6 h-6 text-violet-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">
                  AI Recommendations
                </h1>
              </div>
              <p className="text-white/50 mb-8 ml-14">
                Personalized learning paths tailored to your progress.
              </p>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 mb-4 animate-pulse">
                      <Layout className="w-8 h-8 text-violet-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      Generating your curriculum...
                    </h2>
                    <p className="text-white/50 max-w-md mx-auto">
                      Our AI is analyzing your quiz history to create the
                      perfect learning path for you.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ willChange: 'transform, opacity' }}
                      className="group p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-colors transform-gpu cursor-pointer"
                      onClick={() =>
                        navigate({
                          to: '/ai-recommendations/$recId',
                            params: { recId: rec.id },
                          })
                        }
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                                {rec.topic}
                              </h3>
                              <div
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                  rec.difficulty === 'Beginner'
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    : rec.difficulty === 'Intermediate'
                                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                }`}
                              >
                                {rec.difficulty}
                              </div>
                            </div>
                            <p className="text-white/60 mb-4 leading-relaxed">
                              {rec.reason}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-white/40">
                              <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {rec.estimatedTime}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <BookOpen size={14} />
                                {rec.lessons.length} lessons
                              </div>
                            </div>
                          </div>
                          <div className="p-2 rounded-full bg-white/5 group-hover:bg-violet-500/20 transition-colors">
                            <ArrowRight
                              size={20}
                              className="text-white/40 group-hover:text-violet-400 transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>
    </Protect>
  )
}
