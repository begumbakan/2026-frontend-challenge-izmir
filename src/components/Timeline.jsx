import { useState, useMemo } from 'react'
import { useAllClues } from '../hooks/useAllClues'
import { FORMS } from '../constants'

const ALL_TYPES = Object.values(FORMS).map((f) => ({ key: f.type, label: f.label }))

const TYPE_LABELS = {
  sightings: 'Sighting',
  tips: 'Anonymous Tip',
  messages: 'Message',
  checkins: 'Field Check-In',
  notes: 'Detective Note',
}

function parseDateParts(rawDate) {
  if (!rawDate) return { day: '', time: '' }
  const date = new Date(rawDate.replace(' ', 'T'))
  if (isNaN(date.getTime())) return { day: '', time: '' }
  return {
    day: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }
}

function getKeyDetail(clue) {
  const priority = ['location', 'message', 'note', 'tip', 'status', 'seen with']
  for (const keyword of priority) {
    const match = clue.answers.find((a) => a.label.toLowerCase().includes(keyword))
    if (match?.value) return { label: match.label, value: match.value }
  }
  const fallback = clue.answers.find(
    (a) =>
      !a.label.toLowerCase().includes('name') &&
      !a.label.toLowerCase().includes('coordinate') &&
      !a.label.toLowerCase().includes('timestamp')
  )
  return fallback ? { label: fallback.label, value: fallback.value } : null
}

export default function Timeline() {
  const { clues, loading, error } = useAllClues()
  const [activeTypes, setActiveTypes] = useState(new Set())

  function toggleType(key) {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const grouped = useMemo(() => {
    const pool = activeTypes.size > 0
      ? clues.filter((c) => activeTypes.has(c.type))
      : clues

    const map = {}
    for (const clue of pool) {
      const key = clue.rawDate ? clue.rawDate.slice(0, 10) : 'unknown'
      if (!map[key]) map[key] = []
      map[key].push(clue)
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [clues, activeTypes])

  const total = grouped.reduce((n, [, items]) => n + items.length, 0)

  return (
    <section className="timeline-section">
      <div className="timeline-inner">
        <h2 className="section-title">Investigation Timeline</h2>
        <p className="section-subtitle">Chronological record of all events — trace Podo's trail</p>

        <div className="timeline-filters">
          {ALL_TYPES.map(({ key, label }) => (
            <button
              key={key}
              className={`filter-btn type-${key}${activeTypes.has(key) ? ' active' : ''}`}
              onClick={() => toggleType(key)}
            >
              {label}
            </button>
          ))}
          {activeTypes.size > 0 && (
            <button className="filter-clear" onClick={() => setActiveTypes(new Set())}>
              Clear
            </button>
          )}
          <span className="timeline-count">{total} event{total !== 1 ? 's' : ''}</span>
        </div>

        {loading && (
          <div className="clue-board-state">
            Reconstructing timeline
            <span className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        )}

        {error && (
          <div className="clue-board-state error">
            Failed to load timeline: {error}
          </div>
        )}

        {!loading && !error && total === 0 && (
          <div className="clue-board-state">No events match the current filter.</div>
        )}

        {!loading && !error && total > 0 && (
          <div className="timeline-track">
            {grouped.map(([dateKey, items]) => {
              const { day } = parseDateParts(items[0].rawDate)
              return (
                <div key={dateKey} className="timeline-day">
                  <div className="timeline-day-label">{day}</div>
                  {items.map((clue) => {
                    const { time } = parseDateParts(clue.rawDate)
                    const detail = getKeyDetail(clue)
                    return (
                      <div key={clue.id} className={`timeline-entry type-${clue.type}`}>
                        <div className="timeline-entry-dot" />
                        <div className="timeline-entry-content">
                          <div className="timeline-entry-meta">
                            <span className="timeline-entry-stamp">
                              {TYPE_LABELS[clue.type] ?? clue.label}
                            </span>
                            {time && <span className="timeline-entry-time">{time}</span>}
                          </div>
                          {clue.name && (
                            <div className="timeline-entry-name">{clue.name}</div>
                          )}
                          {detail && (
                            <div className="timeline-entry-detail">
                              <span className="timeline-entry-detail-label">{detail.label}</span>
                              <span className="timeline-entry-detail-value">{detail.value}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
