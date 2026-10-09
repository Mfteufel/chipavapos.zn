import { useCallback, useState } from 'react'

const KEY = 'chipavapos-age'
const DAYS_30 = 30 * 24 * 60 * 60 * 1000

export type AgeAnswer = 'yes' | 'no' | 'unknown'

function read(): AgeAnswer {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return 'unknown'
    const { answer, ts } = JSON.parse(raw) as { answer: AgeAnswer; ts: number }
    if (Date.now() - ts > DAYS_30 || (answer !== 'yes' && answer !== 'no')) return 'unknown'
    return answer
  } catch {
    return 'unknown'
  }
}

export function useAgeGate() {
  const [answer, setAnswer] = useState<AgeAnswer>(read)
  const respond = useCallback((a: 'yes' | 'no') => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ answer: a, ts: Date.now() }))
    } catch {
      /* sin storage: la respuesta vale solo para esta sesión */
    }
    setAnswer(a)
  }, [])
  return { answer, respond }
}
