// All visible text lives here. Source: docs/website/PAGE-COPY.md (25 Nov 2026), copied as written.
// Entries marked "ADDED" are not in PAGE-COPY.md: they are draft text written by the coder for the
// dashboard sample and the on-device confirmation. Amharic drafts need native-speaker review.

const en = {
  pageTitle: 'Garro - Clear records and payment instructions for cooperatives',
  metaDescription:
    "Garro helps cooperatives record deliveries, close payment periods and prepare payment instructions for the bank. Garro never holds members' money.",
  skip: 'Skip to main content',
  langSwitchLabel: 'Language',
  menuOpen: 'Open menu', // ADDED
  menuClose: 'Close menu', // ADDED
  navLabel: 'Main', // ADDED
  nav: [
    { id: 'how', label: 'How it works' },
    { id: 'safety', label: 'Safety' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'interest', label: 'Register interest' },
  ],
  hero: {
    title: 'Clear records for every member payment.',
    sub: 'Garro helps cooperatives record each delivery, such as milk, and prepare payment instructions for the bank.',
    button: 'Ask for a pilot',
  },
  problem: {
    title: 'Counting by hand slows payment and is hard to check.',
    sub: 'Deliveries are written on paper, added up by hand and checked late. Members wait and ask why.',
  },
  how: {
    title: 'Four steps from delivery to payment.',
    sub: 'Each step leaves a record. A mistake is fixed with a new entry, and the old entry stays.',
    steps: [
      { title: 'Record the delivery', line: 'A clerk records each delivery on a tablet. It works without internet.' },
      { title: 'Close the period', line: "At the end of each period, usually 10 days, Garro adds up each member's deliveries and prices them." },
      { title: 'Two people approve', line: 'One person prepares the payment list. A different person approves it.' },
      { title: 'The bank pays', line: 'Garro prepares a payment file for the bank. The bank pays the members.' },
    ],
  },
  safety: {
    title: "Garro never holds your members' money.",
    sub: 'Garro prepares payment instructions for the bank, and only the bank moves the money.',
    labels: ['Every payment needs two different people to approve it.', 'Records are never edited or deleted.'],
  },
  dashboard: {
    title: 'See every payment period in one place.',
    sub: 'Check deliveries, totals and approvals for each period.',
    caption: 'Sample data. Not a real cooperative.',
    alt: 'A payment period summary page showing sample data',
  },
  // ADDED: labels and sample data for the dashboard component
  workspace: {
    brand: 'Garro',
    userName: 'Sample clerk',
    currency: 'birr',
    locale: 'en-US',
    balanceTitle: 'To be paid this period',
    balanceChangeLabel: 'compared with the previous period',
    accountName: 'Sample cooperative account',
    periodLabel: 'Payment period',
    periodSwitchLabel: 'Time range',
    cashFlowTitle: 'Delivered value and paid by the bank',
    income: 'Delivered value',
    expenses: 'Paid by the bank',
    transactionsTitle: 'Payout lines',
    goalsTitle: 'Progress',
    sampleBadge: 'Sample data',
    footerNote: 'Sample data. Not a real cooperative.',
    savingsNote: 'Counts update when the bank returns its result file.',
    statusPaid: 'Paid',
    statusPending: 'Awaiting bank',
    statusFailed: 'Failed',
    periods: [
      { id: 'week', label: 'Week', description: 'Each day of the week' },
      { id: 'month', label: 'Month', description: 'Each payment period of the month' },
      { id: 'year', label: 'Year', description: 'Each month of the year' },
    ],
    week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    month: ['Period 1', 'Period 2', 'Period 3'],
    members: ['Sample member 01', 'Sample member 02', 'Sample member 03', 'Sample member 04', 'Sample member 05', 'Sample member 06'],
    categories: ['Payout line', 'Delivery'],
    dates: ['Day 10', 'Day 10', 'Day 10', 'Day 9', 'Day 9', 'Day 8'],
    goals: ['Members paid this period', 'Accounts confirmed'],
  },
  interest: {
    title: 'Tell us about your cooperative.',
    sub: 'We are preparing a pilot with one dairy cooperative. Leave your details and we will reply.',
    fields: {
      coop: 'Cooperative name',
      contact: 'Contact person',
      phone: 'Phone',
      region: 'Region',
      members: 'Number of members',
    },
    button: 'Send details',
    privacy: 'We use your details only to reply to you. We do not share them. Questions: [privacy contact to confirm]',
    errorRequired: 'Please fill in this field.',
    errorPhone: 'Write the phone number using digits only.',
    errorMembers: 'Write the number of members using digits only.', // ADDED
    // ADDED: no backend yet, so the card says plainly that nothing was sent
    notice: 'Preview: this form is not connected yet. It sends nothing.', // ADDED, remove when the form is connected
    doneTitle: 'This form is not connected yet.',
    doneBody: 'Nothing was sent or saved. Please reach us directly:',
    again: 'Fill in again',
  },
  footer: {
    line1: 'Garro: records and payment instructions for cooperatives.',
    status: 'Garro is preparing a pilot with one dairy cooperative.',
    phone: '[phone to confirm]',
    email: '[email to confirm]',
    address: '[address to confirm]',
    legal: '[legal name to confirm] © 2026',
    logoAlt: 'Garro',
  },
}

const am: typeof en = {
  pageTitle: 'ጋሮ - ለማኅበራት ግልጽ መዝገብና የክፍያ መመሪያ',
  metaDescription:
    'ጋሮ ማኅበራት ርክክብን እንዲመዘግቡ፣ የክፍያ ጊዜን እንዲዘጉ እና ለባንክ የክፍያ መመሪያ እንዲያዘጋጁ ይረዳል። ጋሮ የአባላትን ገንዘብ በፍጹም አይይዝም።',
  skip: 'ወደ ዋናው ይዘት ዝለል',
  langSwitchLabel: 'ቋንቋ',
  menuOpen: 'ምናሌ ክፈት',
  menuClose: 'ምናሌ ዝጋ',
  navLabel: 'ዋና',
  nav: [
    { id: 'how', label: 'እንዴት ይሰራል' },
    { id: 'safety', label: 'ደህንነት' },
    { id: 'dashboard', label: 'ዳሽቦርድ' },
    { id: 'interest', label: 'ፍላጎትዎን ያስመዝግቡ' },
  ],
  hero: {
    title: 'ለእያንዳንዱ የአባል ክፍያ ግልጽ መዝገብ።',
    sub: 'ጋሮ ማኅበራት እያንዳንዱን ርክክብ፣ ለምሳሌ ወተት፣ እንዲመዘግቡ እና ለባንክ የክፍያ መመሪያ እንዲያዘጋጁ ይረዳል።',
    button: 'ሙከራ ይጠይቁ',
  },
  problem: {
    title: 'በእጅ መቁጠር ክፍያን ያዘገያል፤ ለመፈተሽም ከባድ ነው።',
    sub: 'ርክክብ በወረቀት ይጻፋል፣ በእጅ ይደመራል፣ ዘግይቶም ይፈተሻል። አባላት ይጠብቃሉ፤ ለምን እንደዘገየም ይጠይቃሉ።',
  },
  how: {
    title: 'ከርክክብ እስከ ክፍያ አራት ደረጃዎች።',
    sub: 'እያንዳንዱ ደረጃ መዝገብ ይተዋል። ስህተት በአዲስ ግቤት ይታረማል፤ የድሮው ግቤት አይደለዝም።',
    steps: [
      { title: 'ርክክቡን ይመዝግቡ', line: 'ጸሐፊው እያንዳንዱን ርክክብ በታብሌት ይመዘግባል። ኢንተርኔት ባይኖርም ይሰራል።' },
      { title: 'ጊዜውን ይዝጉ', line: 'በእያንዳንዱ ጊዜ መጨረሻ፣ ብዙ ጊዜ በ10 ቀን፣ ጋሮ የእያንዳንዱን አባል ርክክብ ደምሮ ዋጋ ያወጣል።' },
      { title: 'ሁለት ሰዎች ያጸድቃሉ', line: 'አንድ ሰው የክፍያ ዝርዝሩን ያዘጋጃል። ሌላ ሰው ያጸድቀዋል።' },
      { title: 'ባንኩ ይከፍላል', line: 'ጋሮ ለባንኩ የክፍያ ፋይል ያዘጋጃል። ባንኩ ለአባላት ይከፍላል።' },
    ],
  },
  safety: {
    title: 'ጋሮ የአባላትዎን ገንዘብ በፍጹም አይይዝም።',
    sub: 'ጋሮ ለባንክ የክፍያ መመሪያ ያዘጋጃል፤ ገንዘቡን የሚያንቀሳቅሰው ባንኩ ብቻ ነው።',
    labels: ['ማንኛውም ክፍያ ሁለት የተለያዩ ሰዎች ማጽደቅ አለባቸው።', 'መዝገቦች አይስተካከሉም ወይም አይሰረዙም።'],
  },
  dashboard: {
    title: 'እያንዳንዱን የክፍያ ጊዜ በአንድ ቦታ ይመልከቱ።',
    sub: 'የእያንዳንዱን ጊዜ ርክክብ፣ ድምርና ማጽደቂያ ይመልከቱ።',
    caption: 'የናሙና መረጃ ነው፤ እውነተኛ ማኅበር አይደለም።',
    alt: 'የናሙና መረጃ የሚያሳይ የክፍያ ጊዜ ማጠቃለያ ገጽ',
  },
  workspace: {
    brand: 'ጋሮ',
    userName: 'የናሙና ጸሐፊ',
    currency: 'ብር',
    locale: 'am-ET',
    balanceTitle: 'በዚህ ጊዜ የሚከፈል',
    balanceChangeLabel: 'ከቀደመው ጊዜ ጋር ሲነጻጸር',
    accountName: 'የናሙና የማኅበር ሒሳብ',
    periodLabel: 'የክፍያ ጊዜ',
    periodSwitchLabel: 'የጊዜ ክልል',
    cashFlowTitle: 'የተረከበ ዋጋ እና በባንክ የተከፈለ',
    income: 'የተረከበ ዋጋ',
    expenses: 'በባንክ የተከፈለ',
    transactionsTitle: 'የክፍያ መስመሮች',
    goalsTitle: 'እድገት',
    sampleBadge: 'የናሙና መረጃ',
    footerNote: 'የናሙና መረጃ ነው፤ እውነተኛ ማኅበር አይደለም።',
    savingsNote: 'ባንኩ የውጤት ፋይሉን ሲመልስ ቁጥሮቹ ይዘምናሉ።',
    statusPaid: 'ተከፍሏል',
    statusPending: 'ባንክ በመጠበቅ ላይ',
    statusFailed: 'አልተሳካም',
    periods: [
      { id: 'week', label: 'ሳምንት', description: 'የሳምንቱ እያንዳንዱ ቀን' },
      { id: 'month', label: 'ወር', description: 'የወሩ እያንዳንዱ የክፍያ ጊዜ' },
      { id: 'year', label: 'ዓመት', description: 'የዓመቱ እያንዳንዱ ወር' },
    ],
    week: ['ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ', 'እሁድ'],
    month: ['ጊዜ 1', 'ጊዜ 2', 'ጊዜ 3'],
    members: ['የናሙና አባል 01', 'የናሙና አባል 02', 'የናሙና አባል 03', 'የናሙና አባል 04', 'የናሙና አባል 05', 'የናሙና አባል 06'],
    categories: ['የክፍያ መስመር', 'ርክክብ'],
    dates: ['ቀን 10', 'ቀን 10', 'ቀን 10', 'ቀን 9', 'ቀን 9', 'ቀን 8'],
    goals: ['በዚህ ጊዜ የተከፈላቸው አባላት', 'የተረጋገጡ ሒሳቦች'],
  },
  interest: {
    title: 'ስለ ማኅበርዎ ይንገሩን።',
    sub: 'ከአንድ የወተት ማኅበር ጋር ሙከራ እያዘጋጀን ነው። ዝርዝርዎን ይተዉ፤ እንመልስልዎታለን።',
    fields: {
      coop: 'የማኅበሩ ስም',
      contact: 'የአድራሻ ሰው ስም',
      phone: 'ስልክ ቁጥር',
      region: 'ክልል',
      members: 'የአባላት ብዛት',
    },
    button: 'ዝርዝር ላክ',
    privacy: 'ዝርዝርዎን እርስዎን ለመመለስ ብቻ እንጠቀማለን። ለሌላ አካል አንሰጥም። ለጥያቄ፦ [የግላዊነት አድራሻ ይረጋገጥ]',
    errorRequired: 'ይህንን መስክ ይሙሉ።',
    errorPhone: 'ስልክ ቁጥሩን በቁጥር ብቻ ይጻፉ።',
    errorMembers: 'የአባላትን ብዛት በቁጥር ብቻ ይጻፉ።',
    notice: 'ቅድመ እይታ፦ ይህ ቅጽ ገና አልተገናኘም። ምንም አይልክም።',
    doneTitle: 'ይህ ቅጽ ገና አልተገናኘም።',
    doneBody: 'ምንም አልተላከም፤ ምንም አልተቀመጠም። እባክዎ በቀጥታ ያግኙን፦',
    again: 'እንደገና ይሙሉ',
  },
  footer: {
    line1: 'ጋሮ፦ ለማኅበራት መዝገብና የክፍያ መመሪያ።',
    status: 'ጋሮ ከአንድ የወተት ማኅበር ጋር ለሙከራ በዝግጅት ላይ ነው።',
    phone: '[ስልክ ይረጋገጥ]',
    email: '[ኢሜይል ይረጋገጥ]',
    address: '[አድራሻ ይረጋገጥ]',
    legal: '[ህጋዊ ስም ይረጋገጥ] © 2026',
    logoAlt: 'ጋሮ',
  },
}

export const copy = { am, en }
export type Lang = keyof typeof copy
export type Copy = typeof en
