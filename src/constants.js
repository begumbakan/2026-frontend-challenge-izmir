export const FORMS = {
  CHECKINS: {
    id: '261134527667966',
    apiKey: import.meta.env.VITE_API_KEY_CHECKINS,
    label: 'Check-Ins',
    icon: '📍',
    description: 'Field agents: log your current location and status.',
    type: 'checkins',
  },
  MESSAGES: {
    id: '261133651963962',
    apiKey: import.meta.env.VITE_API_KEY_MESSAGES,
    label: 'Messages',
    icon: '✉️',
    description: 'Leave a message for the investigation team.',
    type: 'messages',
  },
  SIGHTINGS: {
    id: '261133720555956',
    apiKey: import.meta.env.VITE_API_KEY_SIGHTINGS,
    label: 'Sightings',
    icon: '👁️',
    description: 'Spotted Podo? Report your sighting here.',
    type: 'sightings',
  },
  PERSONAL_NOTES: {
    id: '261134449238963',
    apiKey: import.meta.env.VITE_API_KEY_PERSONAL_NOTES,
    label: 'Personal Notes',
    icon: '📝',
    description: 'Record your private detective notes.',
    type: 'notes',
  },
  ANONYMOUS_TIPS: {
    id: '261134430330946',
    apiKey: import.meta.env.VITE_API_KEY_ANONYMOUS_TIPS,
    label: 'Anonymous Tips',
    icon: '🔍',
    description: "Submit a confidential tip about Podo's whereabouts.",
    type: 'tips',
  },
}

export const CASE_BOARD_FORMS = [FORMS.SIGHTINGS, FORMS.ANONYMOUS_TIPS, FORMS.MESSAGES]

export const ALL_FORMS = Object.values(FORMS)
