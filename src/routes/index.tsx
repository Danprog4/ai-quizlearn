import React, { useState, useEffect } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { useServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { Lock } from 'lucide-react'

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

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    throw redirect({
      to: '/sign-in/$',
    })
  }

  // We can reuse the getUserStats logic or call it here
  // But since getUserStats is already a server fn, we can just return what we need
  // Actually simpler to just rely on Route loader if we want data on entry
  return { userId }
})

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { url?: string } => {
    return {
      url: search.url as string,
    }
  },
  beforeLoad: async () => await authStateFn(),
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
  const initialDailyCount = stats?.dailyQuizCount || 0
  const [sessionDailyCount, setSessionDailyCount] = useState(initialDailyCount)
  const freeLimit = 3
  const remainingFree = Math.max(0, freeLimit - sessionDailyCount)

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

    if (!isPro && remainingFree <= 0) {
      setInputError("You've reached your daily limit of 3 free quizzes.")
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
      // Optimistically increment usage
      setSessionDailyCount((prev) => prev + 1)
    } catch (error: any) {
      console.error('Failed to generate quiz:', error)
      if (error.message?.includes('DAILY_LIMIT_REACHED')) {
        setInputError("You've reached your daily limit of 3 free quizzes.")
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

      {/* Daily Usage Banner */}
      {!isPro && (
        <div className="relative z-20 mb-4 px-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Lock size={14} className="text-amber-400" />
            <span className="text-xs font-medium text-white/70">
              Free Quizzes Available Today:{' '}
              <span className="text-white font-bold">{remainingFree}</span>/3
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-6 z-10">
        <AnimatePresence mode="wait">
          {appState === 'input' && (
            <InputSection
              url={url}
              setUrl={(val) => {
                setUrl(val)
                if (inputError) setInputError(null)
              }}
              handleSubmit={handleSubmit}
              inputError={inputError}
              handleChipClick={handleChipClick}
            />
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
