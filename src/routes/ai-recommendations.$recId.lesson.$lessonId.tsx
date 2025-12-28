import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { UserButton } from '@clerk/tanstack-react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, Target } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Background } from '../components/home/Background'
import { LoadingSection } from '../components/home/LoadingSection'
import { QuizSection } from '../components/home/QuizSection'
import { RecapSection } from '../components/home/RecapSection'
import { Protect } from '@clerk/tanstack-react-start'
import {
  generateLessonQuiz,
  getRecommendations,
  type Recommendation,
  type QuizResponse,
} from '../server/main/main'
import {
  fetchRecommendationsCached,
  recordLessonProgress,
} from '../lib/recommendations'

export const Route = createFileRoute(
  '/ai-recommendations/$recId/lesson/$lessonId',
)({
  beforeLoad: async () => await authStateFn(),
  component: LessonQuizPage,
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

type AppState = 'ready' | 'loading' | 'quiz' | 'recap'

function LessonQuizPage() {
  const navigate = useNavigate()
  const { recId, lessonId } = Route.useParams()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loadingRec, setLoadingRec] = useState(true)
  const [appState, setAppState] = useState<AppState>('ready')
  const [quizData, setQuizData] = useState<QuizResponse | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<
    { questionId: number; selected: number; correct: boolean }[]
  >([])
  const [progressSaved, setProgressSaved] = useState(false)

  const generateLessonQuizFn = useServerFn(generateLessonQuiz)

  useEffect(() => {
    setLoadingRec(true)
    fetchRecommendationsCached(getRecommendations)
      .then((data) => {
        setRecommendations(data)
        setLoadingRec(false)
      })
      .catch((err) => {
        console.error('Failed to fetch recommendations:', err)
        setLoadingRec(false)
      })
  }, [])

  const recommendation = useMemo(
    () => recommendations.find((rec) => rec.id === recId),
    [recommendations, recId],
  )

  const lesson = useMemo(
    () => recommendation?.lessons.find((item) => item.id === lessonId),
    [recommendation, lessonId],
  )

  const handleStartQuiz = async () => {
    if (!recommendation || !lesson) return
    setAppState('loading')
    setProgressSaved(false)

    try {
      const quiz = await generateLessonQuizFn({
        data: {
          topic: recommendation.topic,
          lessonTitle: lesson.title,
          lessonFocus: lesson.quizFocus,
        },
      })
      setQuizData(quiz)
      setCurrentQuestion(0)
      setAnswers([])
      setSelectedAnswer(null)
      setShowResult(false)
      setAppState('quiz')
    } catch (error) {
      console.error('Failed to generate lesson quiz:', error)
      setAppState('ready')
    }
  }

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !quizData) return
    const currentQ = quizData.questions[currentQuestion]
    const isCorrect = selectedAnswer === currentQ.correctAnswer
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = {
      questionId: currentQ.id,
      selected: selectedAnswer,
      correct: isCorrect,
    }
    setAnswers(newAnswers)
    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (!quizData) return

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setAppState('recap')
    }
  }

  const handleRestartQuiz = () => {
    setQuizData(null)
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
    setAppState('ready')
  }

  const correctCount = answers.filter((a) => a.correct).length
  const scorePercentage = quizData
    ? Math.round((correctCount / quizData.questions.length) * 100)
    : 0

  useEffect(() => {
    if (appState === 'recap' && recommendation && lesson && !progressSaved) {
      recordLessonProgress(recommendation.id, lesson.id, scorePercentage)
      setProgressSaved(true)
    }
  }, [appState, recommendation, lesson, scorePercentage, progressSaved])

  if (loadingRec) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <Background />
        <div className="max-w-4xl mx-auto px-6 py-10 text-white/60">
          Loading lesson...
        </div>
      </div>
    )
  }

  if (!recommendation || !lesson) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <Background />
        <div className="max-w-4xl mx-auto px-6 py-10 text-white">
          <button
            onClick={() =>
              navigate({ to: '/ai-recommendations/$recId', params: { recId } })
            }
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft size={18} />
            Back to course
          </button>
          <h1 className="text-2xl font-bold">Lesson not found</h1>
          <p className="text-white/60 mt-2">
            The lesson you selected is no longer available.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Protect>
      <div className="relative min-h-screen flex flex-col items-center selection:bg-indigo-500/30">
        <Background />

        <header className="w-full max-w-5xl px-6 py-6 md:py-8 flex justify-between items-center z-10 mx-auto">
          <button
            onClick={() =>
              navigate({ to: '/ai-recommendations/$recId', params: { recId } })
            }
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back to course</span>
          </button>
          <UserButton />
        </header>

        <main className="flex-1 flex flex-col items-center w-full max-w-4xl px-6 z-10">
          <AnimatePresence mode="wait">
            {appState === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-6"
              >
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
                    <Target size={14} />
                    Lesson
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {lesson.title}
                  </h1>
                  <p className="text-white/60">{lesson.description}</p>
                </div>
                <button
                  onClick={handleStartQuiz}
                  className="w-full px-4 py-3 text-nowrap rounded-2xl bg-indigo-600 text-white font-bold transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2"
                >
                  Start quiz
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {appState === 'loading' && <LoadingSection />}

            {appState === 'quiz' && quizData && (
              <QuizSection
                quizData={quizData}
                currentQuestion={currentQuestion}
                correctCount={correctCount}
                answers={answers}
                selectedAnswer={selectedAnswer}
                showResult={showResult}
                handleAnswerSelect={handleAnswerSelect}
                handleConfirmAnswer={handleConfirmAnswer}
                handleNextQuestion={handleNextQuestion}
              />
            )}

            {appState === 'recap' && quizData && (
              <div className="flex flex-col items-center w-full">
                <RecapSection
                  quizData={quizData}
                  correctCount={correctCount}
                  answers={answers}
                  scorePercentage={scorePercentage}
                  handleRestartQuiz={handleRestartQuiz}
                />
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Protect>
  )
}
