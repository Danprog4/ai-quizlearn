import type { Recommendation } from '../server/main/main'

const CACHE_KEY = 'ai-quizlearn:recommendations:v2'
const PROGRESS_KEY = 'ai-quizlearn:rec-progress:v1'
let inflightRecommendations: Promise<Recommendation[]> | null = null

type ProgressEntry = {
  completedLessons: string[]
  lastLessonId?: string
  lastScore?: number
  lastCompletedAt?: string
  history: { lessonId: string; score: number; completedAt: string }[]
}

type ProgressStore = Record<string, ProgressEntry>

const isBrowser = typeof window !== 'undefined'

const readJson = <T>(key: string): T | null => {
  if (!isBrowser) return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

const writeJson = (key: string, value: unknown) => {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage errors (quota, private mode).
  }
}

export const getCachedRecommendations = (): Recommendation[] | null => {
  const payload = readJson<{ data: Recommendation[] }>(CACHE_KEY)
  return payload?.data ?? null
}

export const setCachedRecommendations = (data: Recommendation[]) => {
  writeJson(CACHE_KEY, { data, savedAt: new Date().toISOString() })
}

export const clearRecommendationsCache = () => {
  if (!isBrowser) return
  window.localStorage.removeItem(CACHE_KEY)
}

export const fetchRecommendationsCached = async (
  fetcher: () => Promise<Recommendation[]>,
): Promise<Recommendation[]> => {
  const cached = getCachedRecommendations()
  if (cached && cached.length > 0) {
    return cached
  }

  if (!inflightRecommendations) {
    inflightRecommendations = fetcher()
      .then((data) => {
        if (data && data.length > 0) {
          setCachedRecommendations(data)
        }
        return data || []
      })
      .finally(() => {
        inflightRecommendations = null
      })
  }

  return inflightRecommendations
}

export const prefetchRecommendations = (
  fetcher: () => Promise<Recommendation[]>,
) => {
  return fetchRecommendationsCached(fetcher)
}

export const getRecommendationProgress = (recId: string): ProgressEntry => {
  const store = readJson<ProgressStore>(PROGRESS_KEY) ?? {}
  return (
    store[recId] ?? {
      completedLessons: [],
      history: [],
    }
  )
}

export const recordLessonProgress = (
  recId: string,
  lessonId: string,
  score: number,
) => {
  const store = readJson<ProgressStore>(PROGRESS_KEY) ?? {}
  const entry = store[recId] ?? { completedLessons: [], history: [] }
  const completed = new Set(entry.completedLessons)
  completed.add(lessonId)

  const completedAt = new Date().toISOString()
  const history = [
    ...entry.history,
    { lessonId, score, completedAt },
  ].slice(-5)

  store[recId] = {
    ...entry,
    completedLessons: Array.from(completed),
    lastLessonId: lessonId,
    lastScore: score,
    lastCompletedAt: completedAt,
    history,
  }

  writeJson(PROGRESS_KEY, store)
}
