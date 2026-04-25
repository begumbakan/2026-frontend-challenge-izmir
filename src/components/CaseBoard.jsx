import { useState } from 'react'
import { useJotformData } from '../hooks/useJotformData'
import { FORMS } from '../constants'
import ClueCard from './ClueCard'

const TABS = [
  { key: 'sightings', form: FORMS.SIGHTINGS, label: 'Sightings' },
  { key: 'tips', form: FORMS.ANONYMOUS_TIPS, label: 'Anonymous Tips' },
  { key: 'messages', form: FORMS.MESSAGES, label: 'Messages' },
  { key: 'checkins', form: FORMS.CHECKINS, label: 'Check-Ins' },
  { key: 'notes', form: FORMS.PERSONAL_NOTES, label: 'Personal Notes' },
]

function TabContent({ form, type }) {
  const { submissions, loading, error } = useJotformData(form.id, form.apiKey)

  if (!form.apiKey) {
    return (
      <div className="clue-board-state">
        <span>API key missing for this form.</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="clue-board-state">
        <span>Retrieving intelligence</span>
        <span className="loading-dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="clue-board-state error">
        Failed to load clues: {error}
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="clue-board-state">
        No clues found in this category yet.
      </div>
    )
  }

  return (
    <div className="clue-grid">
      {submissions.map((sub) => (
        <ClueCard key={sub.id} submission={sub} type={type} />
      ))}
    </div>
  )
}

export default function CaseBoard() {
  const [activeTab, setActiveTab] = useState('sightings')
  const current = TABS.find((t) => t.key === activeTab)

  return (
    <section id="case-board" className="case-board">
      <div className="case-board-inner">
        <h2 className="section-title">Case Board</h2>
        <p className="section-subtitle">
          Piece together the clues — find out where Podo is
        </p>

        <div className="case-board-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <TabContent form={current.form} type={current.key} />
      </div>
    </section>
  )
}
