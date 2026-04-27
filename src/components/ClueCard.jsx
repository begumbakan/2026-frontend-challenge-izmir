const TYPE_LABELS = {
  sightings: 'Sighting',
  tips: 'Anonymous Tip',
  messages: 'Message',
  checkins: 'Field Check-In',
  notes: 'Detective Note',
}

export default function ClueCard({ submission, type }) {
  return (
    <div className={`clue-card type-${type}`}>
      <div className="clue-pin" />
      <div className="clue-stamp">{TYPE_LABELS[type] ?? type}</div>
      <div className="clue-body">
        {submission.answers.map((answer, i) => (
          <div key={i} className="clue-field">
            <span className="clue-label">{answer.label}</span>
            <span className="clue-value">{answer.value}</span>
          </div>
        ))}
        {submission.answers.length === 0 && (
          <span className="clue-empty">No details recorded</span>
        )}
      </div>
    </div>
  )
}
