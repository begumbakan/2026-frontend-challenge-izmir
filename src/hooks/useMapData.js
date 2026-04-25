import { useState, useEffect } from 'react'
import JotformModule from 'jotform'
const Jotform = JotformModule.default ?? JotformModule
import { FORMS } from '../constants'

const MAP_FORMS = [FORMS.SIGHTINGS, FORMS.CHECKINS, FORMS.ANONYMOUS_TIPS]

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

function parseCoords(answer) {
  if (!answer) return null
  if (typeof answer === 'object' && answer.lat && answer.lng) {
    const lat = parseFloat(answer.lat)
    const lng = parseFloat(answer.lng)
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
  }
  if (typeof answer === 'string') {
    const parts = answer.split(',').map((s) => parseFloat(s.trim()))
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] }
    }
  }
  return null
}

function getField(answers, name) {
  const field = Object.values(answers).find(
    (a) => a.name === name || a.name === name.toLowerCase()
  )
  if (!field?.answer) return ''
  if (typeof field.answer === 'object') return Object.values(field.answer).filter(Boolean).join(', ')
  return String(field.answer).trim()
}

export function useMapData() {
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      setLoading(true)
      setError(null)

      try {
        const results = await Promise.all(
          MAP_FORMS.filter((f) => f.apiKey).map(async (form) => {
            const client = new Jotform(form.apiKey)
            const data = await client.form.getSubmissions(form.id, {
              limit: 50,
              orderby: 'created_at',
              direction: 'DESC',
            })

            return (data.content || [])
              .map((sub) => {
                const a = sub.answers || {}
                const coords = parseCoords(
                  Object.values(a).find((f) => f.name === 'coordinates')?.answer
                )
                if (!coords) return null

                return {
                  id: sub.id,
                  type: form.type,
                  label: form.label,
                  coords,
                  location: applyCorrections(getField(a, 'location')),
                  name:
                    applyCorrections(getField(a, 'personName')) ||
                    applyCorrections(getField(a, 'fullName')) ||
                    null,
                  subject: applyCorrections(getField(a, 'suspectName')),
                  seenWith: applyCorrections(getField(a, 'seenWith')),
                  note: getField(a, 'note') || getField(a, 'tip') || '',
                  date: sub.created_at ? sub.created_at.slice(0, 10) : '',
                }
              })
              .filter(Boolean)
          })
        )

        if (!cancelled) setPoints(results.flat())
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    return () => {
      cancelled = true
    }
  }, [])

  return { points, loading, error }
}
