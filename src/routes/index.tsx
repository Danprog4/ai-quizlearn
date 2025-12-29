import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { useServerFn } from '@tanstack/react-start'
import { BarChart3, BookOpen, Lock, Sparkles, Zap } from 'lucide-react'

import {
  generateQuiz,
  type QuizResponse,
  getUserStats,
} from '../server/main/main'
import { Header } from '../components/home/Header'
import { Footer } from '../components/home/Footer'
import { Background } from '../components/home/Background'
import { InputSection } from '../components/home/InputSection'
import { LoadingSection } from '../components/home/LoadingSection'
import { QuizSection } from '../components/home/QuizSection'
import { RecapSection } from '../components/home/RecapSection'
import { PremiumAd } from '../components/home/PremiumAd'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { url?: string } => {
    return {
      url: search.url as string,
    }
  },
  loader: async () => await getUserStats(),
  component: Home,
})

type AppState = 'input' | 'loading' | 'quiz' | 'recap'

export function Home() {
  const { url: searchUrl } = Route.useSearch()
  const stats = Route.useLoaderData()
  const [url, setUrl] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [appState, setAppState] = useState<AppState>('input')

  // Quiz state
  const [quizData, setQuizData] = useState<QuizResponse | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<
    { questionId: number; selected: number; correct: boolean }[]
  >([])

  const generateQuizFn = useServerFn(generateQuiz)

  const isPro = stats?.isPro || false
  const isSignedIn = Boolean(stats)
  const freeLimit = 3
  const initialDailyCount = stats?.dailyQuizCount || 0
  const [sessionDailyCount, setSessionDailyCount] = useState(initialDailyCount)
  const remainingFree = Math.max(0, freeLimit - sessionDailyCount)
  const shouldLimit = isSignedIn && !isPro
  const isLanding = appState === 'input'
  const heroVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
  }
  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }

  const validateUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e?: React.FormEvent, urlToSubmit?: string) => {
    e?.preventDefault()

    if (shouldLimit && remainingFree <= 0) {
      setInputError("You've reached your daily limit of 3 quizzes.")
      return
    }

    const finalUrl = urlToSubmit || url
    if (!finalUrl.trim()) {
      setInputError('Paste a docs URL to continue.')
      return
    }
    if (!validateUrl(finalUrl)) {
      setInputError("That doesn't look like a valid URL.")
      return
    }

    setInputError(null)
    setAppState('loading')

    try {
      const quiz = await generateQuizFn({ data: { url: finalUrl } })
      setQuizData(quiz)
      setCurrentQuestion(0)
      setAnswers([])
      setSelectedAnswer(null)
      setShowResult(false)
      setAppState('quiz')
      if (shouldLimit) {
        setSessionDailyCount((prev) => prev + 1)
      }
    } catch (error: any) {
      console.error('Failed to generate quiz:', error)
      if (error.message?.includes('DAILY_LIMIT_REACHED')) {
        setInputError("You've reached your daily limit of 3 quizzes.")
      } else {
        setInputError('Failed to generate quiz. Please try again.')
      }
      setAppState('input')
    }
  }

  useEffect(() => {
    if (searchUrl) {
      setUrl(searchUrl)
      handleSubmit(undefined, searchUrl)
    }
  }, [searchUrl])

  const handleChipClick = (exampleUrl: string) => {
    setUrl(exampleUrl)
    setInputError(null)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !quizData) return

    const question = quizData.questions[currentQuestion]
    if (!question) return

    const isCorrect = selectedAnswer === question.correctAnswer

    setAnswers([
      ...answers,
      {
        questionId: question.id,
        selected: selectedAnswer,
        correct: isCorrect,
      },
    ])

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
    setUrl('')
    setQuizData(null)
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
    setAppState('input')
  }

  const correctCount = answers.filter((a) => a.correct).length
  const scorePercentage = quizData
    ? Math.round((correctCount / quizData.questions.length) * 100)
    : 0

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between selection:bg-indigo-500/30">
      <Background />

      <Header onRestart={handleRestartQuiz} />

      {shouldLimit && (
        <div className="relative z-20 mb-4 px-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Lock size={14} className="text-amber-400" />
            <span className="text-xs font-medium text-white/70">
              Daily quizzes left:{' '}
              <span className="text-white font-bold">{remainingFree}</span>/3
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col ${
          isLanding ? 'items-start' : 'items-center'
        } justify-center w-full ${
          isLanding ? 'max-w-6xl' : 'max-w-4xl'
        } px-6 z-10`}
      >
        <AnimatePresence mode="wait">
          {appState === 'input' && (
            <motion.div
              className="w-full space-y-12 py-10"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div
                className="relative w-full text-center space-y-6"
                variants={heroVariants}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <div className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.45em] text-white/35">
                  <span className="text-white/70">URL</span>
                  <span className="text-white/20">-&gt;</span>
                  <span className="text-indigo-300">QUIZ</span>
                  <span className="text-white/20">-&gt;</span>
                  <span className="text-emerald-300">LEARN</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight">
                  Turn documentation into something you can finish.
                </h1>
                <p className="text-lg text-white/60 max-w-2xl mx-auto">
                  Paste a docs URL, get a short quiz, and see exactly what you
                  missed. Save your progress later when you sign up.
                </p>
              </motion.div>

              <motion.div
                className="w-full max-w-5xl mx-auto"
                variants={heroVariants}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
              >
                <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-6 md:px-8 md:py-7 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/60 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-emerald-500/5" />
                  <div className="flex items-center justify-between mb-5 text-xs text-white/50">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
                      Start in 10 seconds
                    </span>
                    <span>No sign-up needed</span>
                  </div>
                  <InputSection
                    url={url}
                    setUrl={(val) => {
                      setUrl(val)
                      if (inputError) setInputError(null)
                    }}
                    handleSubmit={handleSubmit}
                    inputError={inputError}
                    handleChipClick={handleChipClick}
                    variant="minimal"
                  />
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={listVariants}
              >
                {[
                  {
                    title: 'Instant clarity',
                    description:
                      'Short quizzes show the gaps while the docs are fresh.',
                    icon: <Sparkles size={16} className="text-indigo-300" />,
                  },
                  {
                    title: 'Remember longer',
                    description:
                      'Explanations help lock in the ideas you just read.',
                    icon: <BookOpen size={16} className="text-emerald-300" />,
                  },
                  {
                    title: 'Track progress',
                    description:
                      'Save streaks and stats when you decide to sign up.',
                    icon: <BarChart3 size={16} className="text-cyan-300" />,
                  },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
                    variants={heroVariants}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                        {item.icon}
                      </span>
                      <p className="text-sm font-semibold text-white/90">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
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
              {!isPro && <PremiumAd />}
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
