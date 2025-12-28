import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { UserButton } from '@clerk/tanstack-react-start'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  Clock,
  ListChecks,
  Target,
  Trophy,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Background } from '../components/home/Background'
import { getRecommendations, type Recommendation } from '../server/main/main'
import {
  fetchRecommendationsCached,
  getRecommendationProgress,
} from '../lib/recommendations'
import { Protect } from '@clerk/tanstack-react-start'

export const Route = createFileRoute('/ai-recommendations/$recId')({
  beforeLoad: async () => await authStateFn(),
  component: RecommendationDetail,
})

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    throw redirect({
      to: '/sign-in/$',
    })
  }

  return { isAuthenticated }
})

function RecommendationDetail() {
  const navigate = useNavigate()
  const { recId } = Route.useParams()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(() =>
    getRecommendationProgress(recId),
  )
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isIndex = pathname === `/ai-recommendations/${recId}`

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

  useEffect(() => {
    if (!isIndex) {
      return
    }

    setProgress(getRecommendationProgress(recId))
  }, [isIndex, recId, recommendations.length])

  const recommendation = useMemo(
    () => recommendations.find((rec) => rec.id === recId),
    [recommendations, recId],
  )

  if (!isIndex) {
    return <Outlet />
  }

  const completedCount = progress.completedLessons.length
  const totalLessons = recommendation?.lessons.length ?? 0
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const lastLesson = recommendation?.lessons.find(
    (lesson) => lesson.id === progress.lastLessonId,
  )

  const recentHistory = progress.history.slice().reverse().slice(0, 3)

  if (loading) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <Background />
        <div className="max-w-5xl mx-auto px-6 py-10 text-white/60">
          Loading course...
        </div>
      </div>
    )
  }

  if (!recommendation) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <Background />
        <div className="max-w-5xl mx-auto px-6 py-10 text-white">
          <button
            onClick={() => navigate({ to: '/ai-recommendations' })}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft size={18} />
            Back to recommendations
          </button>
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="text-white/60 mt-2">
            The recommendation you selected is no longer available.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Protect>
      <div className="relative min-h-screen flex flex-col selection:bg-indigo-500/30">
        <Background />

        <header className="w-full max-w-6xl px-6 py-6 md:py-8 flex justify-between items-center z-10 mx-auto">
          <button
            onClick={() => navigate({ to: '/ai-recommendations' })}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          <UserButton />
        </header>

        <main className="flex-1 relative z-10">
          <div className="max-w-6xl mx-auto px-6 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <BookOpen className="w-6 h-6 text-violet-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">
                  {recommendation.topic}
                </h1>
              </div>
              <p className="text-white/60 max-w-2xl ml-14">
                {recommendation.reason}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                  <Target size={14} />
                  Progress
                </div>
                <div className="text-2xl font-bold text-white">
                  {progressPercent}% complete
                </div>
                <p className="text-xs text-white/40 mt-2">
                  {completedCount} of {totalLessons} lessons finished
                </p>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-violet-400"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                  <Trophy size={14} />
                  Last task
                </div>
                <div className="text-base font-bold text-white">
                  {lastLesson?.title || 'No quizzes yet'}
                </div>
                <p className="text-xs text-white/40 mt-2">
                  {progress.lastScore
                    ? `Score: ${progress.lastScore}%`
                    : 'Complete a lesson quiz to get a score.'}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                  <Clock size={14} />
                  Estimated time
                </div>
                <div className="text-base font-bold text-white">
                  {recommendation.estimatedTime}
                </div>
                <p className="text-xs text-white/40 mt-2">
                  Difficulty: {recommendation.difficulty}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {recommendation.lessons.map((lesson, index) => {
                  const isComplete = progress.completedLessons.includes(
                    lesson.id,
                  )
                  return (
                    <div
                      key={lesson.id}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold">
                              {lesson.title}
                            </h3>
                            {isComplete && (
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-white/60 text-sm mt-1">
                            {lesson.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigate({
                            to: '/ai-recommendations/$recId/lesson/$lessonId',
                            params: { recId, lessonId: lesson.id },
                          })
                        }
                        className="px-4 py-2 text-nowrap rounded-xl bg-white/10 text-white/80 font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
                      >
                        Start quiz
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
                    <ListChecks size={14} />
                    Recap
                  </div>
                  {recentHistory.length === 0 && (
                    <p className="text-xs text-white/50">
                      Complete a quiz to build your recap list.
                    </p>
                  )}
                  <div className="space-y-3">
                    {recentHistory.map((entry) => {
                      const lesson = recommendation.lessons.find(
                        (item) => item.id === entry.lessonId,
                      )
                      return (
                        <div
                          key={`${entry.lessonId}-${entry.completedAt}`}
                          className="p-3 rounded-xl bg-white/5 border border-white/10"
                        >
                          <p className="text-white text-sm font-semibold">
                            {lesson?.title || entry.lessonId}
                          </p>
                          <p className="text-xs text-white/50 mt-1">
                            Score: {entry.score}%
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
                    <BookOpen size={14} />
                    Focus
                  </div>
                  <p className="text-sm text-white/70">
                    {recommendation.reason}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protect>
  )
}
