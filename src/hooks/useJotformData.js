import { useState, useEffect } from 'react'
import Jotform from 'jotform'

function parseAnswers(answers) {
  if (!answers) return []

  return Object.values(answers)
    .filter((field) => {
      if (!field.answer) return false
      if (typeof field.answer === 'string' && field.answer.trim() === '') return false
      if (typeof field.answer === 'object' && Object.values(field.answer).every((v) => !v)) return false
      return true
    })
    .map((field) => ({
      label: field.text || field.name || 'Field',
      value:
        typeof field.answer === 'object'
          ? Object.values(field.answer).filter(Boolean).join(', ')
          : String(field.answer).trim(),
    }))
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr.replace(' ', 'T'))
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function useJotformData(formId, apiKey) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!apiKey) {
      setError('NO_API_KEY')
      setLoading(false)
      return
    }

    if (!formId) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchSubmissions() {
      setLoading(true)
      setError(null)

      try {
        const client = new Jotform(apiKey)
        const data = await client.form.getSubmissions(formId, {
          limit: 20,
          orderby: 'created_at',
          direction: 'DESC',
        })

        if (cancelled) return

        const parsed = (data.content || []).map((sub) => ({
          id: sub.id,
          date: formatDate(sub.created_at),
          answers: parseAnswers(sub.answers),
        }))
        setSubmissions(parsed)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSubmissions()
    return () => { cancelled = true }
  }, [formId, apiKey])

  return { submissions, loading, error }
}
