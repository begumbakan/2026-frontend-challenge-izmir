import { useState, useEffect } from 'react'
import JotformModule from 'jotform'
const Jotform = JotformModule.default ?? JotformModule
import { FORMS } from '../constants'
import { prettifyLabel } from '../utils/labels'

const BLOCKED_NAMES = new Set(['ss'])

function isJunkSubmission(name, answers) {
  if (name && BLOCKED_NAMES.has(name.toLowerCase().trim())) return true
  const values = answers.map((a) => a.value.trim()).join('')
  return values.length === 0
}

const TEXT_CORRECTIONS = {
  'Ayca': 'Ayça',
  'AYCA': 'Ayça',
  'ayca': 'Ayça',
  'ALICAN': 'Alican',
  'Alicann': 'Alican',
  'alicann': 'Alican',
  'ALICANN': 'Alican',
}

function applyCorrections(text) {
  if (typeof text !== 'string') return text
  return Object.entries(TEXT_CORRECTIONS)
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((t, [wrong, right]) => {
      const escaped = wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return t.replace(new RegExp(`\\b${escaped}\\b`, 'g'), right)
    }, text)
}


function normalizeText(val) {
  if (typeof val !== 'string') return val
  return val.replace(/\s+/g, ' ').trim()
}

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
      label: prettifyLabel(field.text?.trim() || field.name),
      value: applyCorrections(
        typeof field.answer === 'object'
          ? normalizeText(Object.values(field.answer).filter(Boolean).join(', '))
          : normalizeText(String(field.answer))
      ),
    }))
}

function getFieldValue(field) {
  if (!field?.answer) return null
  const val =
    typeof field.answer === 'object'
      ? Object.values(field.answer).filter(Boolean).join(' ').trim()
      : String(field.answer).trim()
  return val || null
}

function extractName(answers) {
  if (!answers) return null
  const fields = Object.values(answers)

  // Check by internal field name (exact, case-insensitive)
  const nameKeys = [
    'personName', 'fullName', 'suspectName', 'reporterName', 'witnessName',
    'sender', 'fromName', 'senderName', 'messageSender',
  ]
  for (const key of nameKeys) {
    const field = fields.find((a) => a.name?.toLowerCase() === key.toLowerCase())
    const val = getFieldValue(field)
    if (val) return applyCorrections(val)
  }

  // Messages form: field name or display label is literally "from"
  const fromField = fields.find(
    (a) =>
      a.name?.toLowerCase() === 'from' ||
      a.text?.toLowerCase().trim() === 'from'
  )
  const fromVal = getFieldValue(fromField)
  if (fromVal) return applyCorrections(fromVal)

  // Fallback: any field name containing 'name'
  const nameField = fields.find(
    (a) => a.name?.toLowerCase().includes('name') && a.answer
  )
  const nameVal = getFieldValue(nameField)
  if (nameVal) return applyCorrections(nameVal)

  return null
}

const DATE_KEYWORDS = ['timestamp', 'datetime', 'date', 'eventdate', 'sightingdate', 'checkintime']

function toValidDate(str) {
  if (!str) return null
  const d = new Date(String(str).replace(' ', 'T'))
  return isNaN(d.getTime()) ? null : str
}

function answerToDateString(ans) {
  if (!ans) return null
  // JotForm date picker object: { year, month, day, hour?, min?, ampm? }
  if (typeof ans === 'object' && ans.year && ans.month && ans.day) {
    let hour = parseInt(ans.hour || '0', 10)
    const min = (ans.min || '00').padStart(2, '0')
    if (ans.ampm === 'PM' && hour < 12) hour += 12
    if (ans.ampm === 'AM' && hour === 12) hour = 0
    const h = String(hour).padStart(2, '0')
    const mo = String(ans.month).padStart(2, '0')
    const dy = String(ans.day).padStart(2, '0')
    return toValidDate(`${ans.year}-${mo}-${dy} ${h}:${min}:00`)
  }
  if (typeof ans === 'string') {
    const str = ans.trim()
    // DD-MM-YYYY HH:MM or DD-MM-YYYY
    const ddmmyyyy = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/)
    if (ddmmyyyy) {
      const [, dd, mm, yyyy, hh = '00', min = '00'] = ddmmyyyy
      return toValidDate(
        `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')} ${hh.padStart(2, '0')}:${min}:00`
      )
    }
    return toValidDate(str)
  }
  return null
}

function extractEventDate(answers, fallback) {
  if (!answers) return fallback
  const fields = Object.values(answers)

  // Substring match so JotForm suffixes like "timestamp14" are caught
  const dateField = fields.find((a) => {
    const name = (a.name || '').toLowerCase()
    const text = (a.text || '').toLowerCase().trim()
    return DATE_KEYWORDS.some((k) => name.includes(k) || text.includes(k))
  })

  if (dateField) {
    const candidate = answerToDateString(dateField.answer)
    if (candidate) return candidate
  }

  return fallback
}

export function useAllClues() {
  const [clues, setClues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      setLoading(true)
      setError(null)

      try {
        const results = await Promise.all(
          Object.values(FORMS).filter((f) => f.apiKey).map(async (form) => {
            const client = new Jotform(form.apiKey)
            const data = await client.form.getSubmissions(form.id, {
              limit: 50,
              orderby: 'created_at',
              direction: 'DESC',
            })
            return (data.content || []).map((sub) => {
              const name = extractName(sub.answers)
              const answers = parseAnswers(sub.answers)
              if (isJunkSubmission(name, answers)) return null
              const rawDate = extractEventDate(sub.answers, sub.created_at || '')
              return {
                id: `${form.type}-${sub.id}`,
                type: form.type,
                label: form.label,
                name,
                date: '',
                rawDate,
                answers,
              }
            }).filter(Boolean)
          })
        )

        if (!cancelled) {
          setClues(results.flat().sort((a, b) => a.rawDate.localeCompare(b.rawDate)))
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { clues, loading, error }
}
