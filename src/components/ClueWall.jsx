import { useState, useMemo } from 'react'
import { useAllClues } from '../hooks/useAllClues'
import ClueCard from './ClueCard'
import { FORMS } from '../constants'

const ALL_TYPES = Object.values(FORMS).map((f) => ({ key: f.type, label: f.label }))


export default function ClueWall() {
  const { clues, loading, error } = useAllClues()
  const [activeTypes, setActiveTypes] = useState(new Set())
  const [activePerson, setActivePerson] = useState('')
  const [search, setSearch] = useState('')

  function toggleType(key) {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function clearAll() {
    setActiveTypes(new Set())
    setActivePerson('')
    setSearch('')
  }

  const persons = useMemo(() => {
    const names = clues.map((c) => c.name).filter((n) => n && n !== 'Unknown')
    return [...new Set(names)].sort()
  }, [clues])

  const filtered = useMemo(() => {
    return clues.filter((clue) => {
      if (activeTypes.size > 0 && !activeTypes.has(clue.type)) return false
      if (activePerson && clue.name !== activePerson) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          (clue.name || '').toLowerCase().includes(q) ||
          clue.label.toLowerCase().includes(q) ||
          clue.answers.some(
            (a) => a.value.toLowerCase().includes(q) || a.label.toLowerCase().includes(q)
          )
        )
      }
      return true
    })
  }, [clues, activeTypes, activePerson, search])

  const hasFilters = activeTypes.size > 0 || activePerson || search.trim()

  return (
    <section id="evidence" className="clue-wall">
      <div className="clue-wall-inner">
        <h2 className="section-title">Evidence Wall</h2>
        <p className="section-subtitle">All clues in one place — filter and search to find Podo</p>

        <div className="clue-wall-controls">
          <div className="clue-wall-filters">
            {ALL_TYPES.map(({ key, label }) => (
              <button
                key={key}
                className={`filter-btn type-${key}${activeTypes.has(key) ? ' active' : ''}`}
                onClick={() => toggleType(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="clue-wall-right-controls">
            {persons.length > 0 && (
              <select
                className="person-select"
                value={activePerson}
                onChange={(e) => setActivePerson(e.target.value)}
              >
                <option value="">All persons</option>
                {persons.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            )}
            <input
              type="text"
              className="clue-search"
              placeholder="Search clues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {hasFilters && (
              <button className="filter-clear" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="clue-wall-board">
          {loading && (
            <div className="clue-board-state corkboard-state">
              Gathering all evidence
              <span className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          )}

          {error && (
            <div className="clue-board-state corkboard-state error">
              Failed to load evidence: {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="clue-wall-count">
                {filtered.length} clue{filtered.length !== 1 ? 's' : ''}
                {hasFilters ? ' matching filters' : ' total'}
              </div>
              {filtered.length === 0 ? (
                <div className="clue-board-state corkboard-state">No clues match the current filters.</div>
              ) : (
                <div className="clue-grid corkboard-grid">
                  {filtered.map((clue) => (
                    <ClueCard key={clue.id} submission={clue} type={clue.type} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
