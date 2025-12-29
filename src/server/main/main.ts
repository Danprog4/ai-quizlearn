import { createServerFn } from '@tanstack/react-start'
import { generateObject, generateText } from 'ai'
import { openrouter } from '../ai'
import z from 'zod'
import { auth, clerkClient } from '@clerk/tanstack-react-start/server'

export const getData = createServerFn().handler(async () => {
  const { text } = await generateText({
    model: openrouter.chat('google/gemini-3-flash-preview'),
    prompt: 'Explain the concept of quantum entanglement.',
  })
  return { text }
})

// Schema for quiz questions
const QuizQuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string(),
})

const QuizResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(QuizQuestionSchema).length(3),
})

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>
export type QuizResponse = z.infer<typeof QuizResponseSchema>

const generateQuizSchema = z.object({ url: z.string().url() })

export const generateQuiz = createServerFn()
  .inputValidator(generateQuizSchema)
  .handler(async ({ data }) => {
    const { userId, isAuthenticated, has } = await auth()
    const isSignedIn = isAuthenticated && Boolean(userId)
    const hasPaidPlan = isSignedIn ? has({ plan: 'pro' }) : false

    if (isSignedIn && userId) {
      const client = clerkClient()
      const user = await client.users.getUser(userId)
      const metadata = user.publicMetadata as {
        dailyQuizCount?: number
        lastQuizDate?: string
      }

      const now = new Date()
      const lastDate = metadata.lastQuizDate
        ? new Date(metadata.lastQuizDate)
        : null

      const isNewDay =
        !lastDate || lastDate.toDateString() !== now.toDateString()
      const currentDailyCount = isNewDay ? 0 : metadata.dailyQuizCount || 0

      if (!hasPaidPlan && currentDailyCount >= 3) {
        throw new Error('DAILY_LIMIT_REACHED')
      }

      await client.users.updateUser(userId, {
        publicMetadata: {
          ...metadata,
          dailyQuizCount: currentDailyCount + 1,
          lastQuizDate: now.toISOString(),
        },
      })
    }

    const { object } = await generateObject({
      model: openrouter.chat('google/gemini-3-flash-preview'),
      schema: QuizResponseSchema,
      prompt: `You are a quiz generator. Based on the documentation URL provided, create a quiz to test understanding of the content.

URL: ${data.url}

Generate exactly 3 multiple-choice questions based on the content of this documentation. Each question should:
1. Test understanding of key concepts
2. Have 4 answer options (only one correct)
3. Include a brief explanation of why the correct answer is right

Make the questions progressively harder from question 1 to 3.

The quiz title should reflect what documentation/topic is being tested.
The description should be a brief overview of what concepts are being tested.`,
    })

    return object
  })

export const updateUserStats = createServerFn()
  .inputValidator(z.object({ score: z.number() }))
  .handler(async ({ data }) => {
    const { userId, isAuthenticated } = await auth()
    if (!isAuthenticated || !userId) return { streak: 0 }

    const client = clerkClient()
    const user = await client.users.getUser(userId)
    const metadata = (user.publicMetadata || {}) as {
      totalScore?: number
      quizCount?: number
      streak?: number
      lastQuizDate?: string
    }

    const now = new Date()
    const lastDate = metadata.lastQuizDate
      ? new Date(metadata.lastQuizDate)
      : null

    let newStreak = metadata.streak || 0
    if (!lastDate) {
      newStreak = 1
    } else {
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)

      const isSameDay = now.toDateString() === lastDate.toDateString()
      const isYesterday = yesterday.toDateString() === lastDate.toDateString()

      if (isYesterday) {
        newStreak += 1
      } else if (!isSameDay) {
        newStreak = 1
      }
    }

    await client.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
        totalScore: (metadata.totalScore || 0) + data.score,
        quizCount: (metadata.quizCount || 0) + 1,
        streak: newStreak,
        lastQuizDate: now.toISOString(),
      },
    })

    return { streak: newStreak }
  })

export const getLeaderboard = createServerFn().handler(async () => {
  const client = clerkClient()
  const users = await client.users.getUserList({
    limit: 50,
  })

  return users.data
    .map((user) => ({
      id: user.id,
      name:
        user.firstName ||
        user.username ||
        user.emailAddresses[0]?.emailAddress.split('@')[0] ||
        'Learner',
      imageUrl: user.imageUrl,
      score: (user.publicMetadata?.totalScore as number) || 0,
      streak: (user.publicMetadata?.streak as number) || 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
})

export const getUserStats = createServerFn().handler(async () => {
  const { userId, isAuthenticated, has } = await auth()
  if (!isAuthenticated || !userId) return null

  const hasPaidPlan = has({ plan: 'pro' })

  const client = clerkClient()
  const user = await client.users.getUser(userId)
  const metadata = user.publicMetadata as {
    totalScore?: number
    quizCount?: number
    streak?: number
    lastQuizDate?: string
    dailyQuizCount?: number
  }

  const now = new Date()
  const lastDate = metadata.lastQuizDate
    ? new Date(metadata.lastQuizDate)
    : null
  const isNewDay = !lastDate || lastDate.toDateString() !== now.toDateString()

  return {
    ...metadata,
    dailyQuizCount: isNewDay ? 0 : metadata.dailyQuizCount || 0,
    isPro: hasPaidPlan,
  }
})

const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  quizFocus: z.string(),
})

const RecommendationSchema = z.object({
  id: z.string(),
  topic: z.string(),
  reason: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  estimatedTime: z.string(),
  lessons: z.array(LessonSchema).min(4).max(6),
})

const RecommendationsResponseSchema = z.object({
  recommendations: z.array(RecommendationSchema).length(3),
})

export type Lesson = z.infer<typeof LessonSchema>
export type Recommendation = z.infer<typeof RecommendationSchema>

export const getRecommendations = createServerFn().handler(async () => {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) return []

  // In a real app, we would fetch user history here
  const { object } = await generateObject({
    model: openrouter.chat('google/gemini-3-flash-preview'),
    schema: RecommendationsResponseSchema,
    prompt: `Generate 3 personalized learning recommendations for a web developer.
Topics should include React, TypeScript, Modern CSS, and AI engineering.
Make the reasons specific and motivating.

Return for each recommendation:
- id: a short slug like "react-hooks"
- topic: a concise title
- reason: why it matters
- difficulty: Beginner, Intermediate, or Advanced
- estimatedTime: a human-readable estimate like "2 weeks"
- lessons: 4 to 6 lessons with id, title, description, and quizFocus

Use short ids like "lesson-1" and unique recommendation ids.`,
  })

  return object.recommendations
})

const LessonQuizSchema = z.object({
  topic: z.string(),
  lessonTitle: z.string(),
  lessonFocus: z.string(),
})

export const generateLessonQuiz = createServerFn()
  .inputValidator(LessonQuizSchema)
  .handler(async ({ data }) => {
    const { userId, isAuthenticated } = await auth()
    if (!isAuthenticated || !userId) {
      throw new Error('Unauthorized')
    }

    const { object } = await generateObject({
      model: openrouter.chat('google/gemini-3-flash-preview'),
      schema: QuizResponseSchema,
      prompt: `You are a quiz generator. Create a quiz for the lesson below.

Topic: ${data.topic}
Lesson: ${data.lessonTitle}
Focus: ${data.lessonFocus}

Generate exactly 3 multiple-choice questions. Each question should:
1. Test understanding of the lesson focus
2. Have 4 answer options (only one correct)
3. Include a brief explanation of why the correct answer is right

Make the questions progressively harder from question 1 to 3.

The quiz title should reflect the lesson title.
The description should be a brief overview of what concepts are being tested.`,
    })

    return object
  })
