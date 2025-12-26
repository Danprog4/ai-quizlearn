import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { useServerFn } from '@tanstack/react-start'

import { generateQuiz, type QuizResponse } from '../server/main/main'
import { Header } from '../components/home/Header'
import { Footer } from '../components/home/Footer'
import { Background } from '../components/home/Background'
import { InputSection } from '../components/home/InputSection'
import { LoadingSection } from '../components/home/LoadingSection'
import { QuizSection } from '../components/home/QuizSection'
import { RecapSection } from '../components/home/RecapSection'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { url?: string } => {
    return {
      url: search.url as string,
    }
  },
  component: Home,
})

type AppState = 'input' | 'loading' | 'quiz' | 'recap'

export function Home() {
  const { url: searchUrl } = Route.useSearch()
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
    } catch (error) {
      console.error('Failed to generate quiz:', error)
      setInputError('Failed to generate quiz. Please try again.')
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
            <RecapSection
              quizData={quizData}
              correctCount={correctCount}
              answers={answers}
              scorePercentage={scorePercentage}
              handleRestartQuiz={handleRestartQuiz}
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
