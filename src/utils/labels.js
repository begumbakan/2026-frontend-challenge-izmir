const FIELD_LABEL_MAP = {
  personname: 'Person Name',
  seenwith: 'Seen With',
  fullname: 'Full Name',
  firstname: 'First Name',
  lastname: 'Last Name',
  suspectname: 'Suspect Name',
  reportername: 'Reporter Name',
  witnessname: 'Witness Name',
  locationdesc: 'Location Description',
  tipdetails: 'Tip Details',
  phonenumber: 'Phone Number',
  emailaddress: 'Email Address',
  messagecontent: 'Message',
  datetime: 'Date & Time',
  timestamp: 'Timestamp',
}

export function prettifyLabel(raw) {
  if (!raw) return 'Field'
  const key = raw.toLowerCase().replace(/[\s_-]/g, '')
  if (FIELD_LABEL_MAP[key]) return FIELD_LABEL_MAP[key]
  return raw
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
