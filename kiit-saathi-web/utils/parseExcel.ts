import * as XLSX from 'xlsx'

let cachedDataMap: { [key: string]: any } = {}

interface Period {
  time: string
  subject: string
  room: string
  faculty: string
}

const semesterKeyFromInput = (input: string): string => {
  const s = String(input || '').trim().toUpperCase()
  
  if (s.includes('|')) {
    const [year, section] = s.split('|')
    
    if (/^CE$/.test(section)) return 'civil4'
    if (/M[1-4](?![A-Z])/.test(section) || section.includes('ME-') || section.includes('MSE')) {
      return 'mse4'
    }
    
    if (year === '2ND') return '4'
    if (year === '3RD') return '6'
    return '6'
  }
  
  const rollNum = s.replace(/\D+/g, '')
  if (rollNum) {
    const num = parseInt(rollNum)
    
    if ((num >= 2402001 && num <= 2402110) ||
        (num >= 2409001 && num <= 2409023) ||
        (num >= 2426001 && num <= 2426021) ||
        (num >= 2502601 && num <= 2502616) ||
        (num >= 2526301 && num <= 2526304)) {
      return 'mse4'
    }
  }
  
  if (s.startsWith('24')) return '4'
  if (s.startsWith('23')) return '6'
  return '6'
}

const normalizeRoll = (r: string | number) => {
  if (!r) return { raw: '', digits: '' }
  const s = r.toString().trim()
  const digits = s.replace(/\D+/g, '')
  return { raw: s, digits }
}

export const parseExcelFiles = async (input: string) => {
  const semKey = semesterKeyFromInput(input)
  
  if (cachedDataMap[semKey]) {
    console.log(`Using cached data for semester ${semKey}`)
    return cachedDataMap[semKey]
  }

  try {
    const files: { [key: string]: { filepath: string; name: string; attendanceFile: string | null } } = {
      '6': { 
        filepath: '/data/6th_sem_Time-Table_and_Section_Detail.xlsx', 
        name: 'CSE/IT 6th Sem',
        attendanceFile: null
      },
      '4': { 
        filepath: '/data/4th_semester_TT_and_Section_Detail.xlsx', 
        name: 'CSE/IT 4th Sem',
        attendanceFile: '/data/Attendance 4th Student list 2024 AB1.XLSX'
      },
      'mse4': { 
        filepath: '/data/SME_4th_Semester_Timetable_Spring_20252026_WEF_01122025.xlsx', 
        name: 'MSE 4th Sem',
        attendanceFile: null
      }
    }

    const chosen = files[semKey] || files['6']
    console.log(`Loading Excel file for ${chosen.name}: ${chosen.filepath}`)
    
    const response = await fetch(chosen.filepath)

    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })

    console.log('Available sheets:', workbook.SheetNames)

    let timetable: { [key: string]: any } = {}
    let sections: { [key: string]: string } = {}

    if (semKey === 'mse4') {
      const ttSheet = workbook.Sheets[workbook.SheetNames[0]]
      const ttData = XLSX.utils.sheet_to_json(ttSheet, { header: 1, defval: '' }) as any[]
      
      timetable = parseMSETimetable(ttData)
      sections = getMSERollNumberMappings()
    } else {
      const ttSheet = workbook.Sheets[workbook.SheetNames[0]]
      const sdSheet = workbook.SheetNames.length > 1 ? workbook.Sheets[workbook.SheetNames[1]] : null

      const ttData = XLSX.utils.sheet_to_json(ttSheet, { header: 1, defval: '' }) as any[]
      const sdData = sdSheet ? XLSX.utils.sheet_to_json(sdSheet, { header: 1, defval: '' }) as any[] : []

      timetable = parseTimetable(ttData, semKey)
      sections = sdData.length > 0 ? parseSections(sdData) : {}
    }

    if (chosen.attendanceFile) {
      console.log(`Loading attendance file: ${chosen.attendanceFile}`)
      try {
        const attendanceResponse = await fetch(chosen.attendanceFile)
        if (attendanceResponse.ok) {
          const attendanceBuffer = await attendanceResponse.arrayBuffer()
          const attendanceWorkbook = XLSX.read(attendanceBuffer, { type: 'array' })
          
          const attendanceSections = parseAttendanceFile(attendanceWorkbook)
          sections = { ...sections, ...attendanceSections }
          console.log(`Merged attendance data: ${Object.keys(attendanceSections).length} new roll numbers`)
        }
      } catch (attendanceError) {
        console.warn('Could not load attendance file:', attendanceError)
      }
    }

    console.log(`Total parsed ${Object.keys(sections).length} roll numbers for ${chosen.name}`)
    console.log(`Parsed ${Object.keys(timetable).length} sections for ${chosen.name}`)

    const result = { sections, timetable, semKey }
    cachedDataMap[semKey] = result
    return result
  } catch (error) {
    console.error('Error parsing Excel files:', error)
    return { sections: {}, timetable: {} }
  }
}

const getMSERollNumberMappings = (): { [key: string]: string } => {
  const sections: { [key: string]: string } = {}
  
  for (let i = 2402001; i <= 2402052; i++) sections[i.toString()] = 'M1'
  for (let i = 2502601; i <= 2502607; i++) sections[i.toString()] = 'M1'
  for (let i = 2402053; i <= 2402110; i++) sections[i.toString()] = 'M2'
  for (let i = 2502608; i <= 2502616; i++) sections[i.toString()] = 'M2'
  for (let i = 2409001; i <= 2409023; i++) sections[i.toString()] = 'M3'
  for (let i = 2426001; i <= 2426021; i++) sections[i.toString()] = 'M4'
  for (let i = 2526301; i <= 2526304; i++) sections[i.toString()] = 'M4'
  
  return sections
}

const parseMSETimetable = (data: any[]) => {
  const timetable: { [key: string]: any } = {}
  const sectionStarts: { section: string; startRow: number }[] = []
  
  for (let i = 0; i < data.length; i++) {
    const rowStr = data[i][0]?.toString().toUpperCase().trim()
    if (rowStr && rowStr.includes('SECTION: ')) {
      const sectionMatch = rowStr.match(/M[1-4]/)
      if (sectionMatch) {
        const section = sectionMatch[0]
        const startRow = i + 2
        sectionStarts.push({ section, startRow })
      }
    }
  }

  if (sectionStarts.length === 0) return {}

  sectionStarts.sort((a, b) => a.startRow - b.startRow)
  sectionStarts.push({ startRow: data.length, section: '' })

  for (let k = 0; k < sectionStarts.length - 1; k++) {
    const { section, startRow } = sectionStarts[k]
    const endRow = sectionStarts[k + 1].startRow
    
    const sectionData = []
    for (let r = startRow; r < endRow; r++) {
      if (data[r]) {
        const col0 = data[r][0]?.toString().toUpperCase().trim()
        if (col0 && (col0.includes('MON') || col0.includes('TUE') || col0.includes('WED') || col0.includes('THU') || col0.includes('FRI'))) {
          sectionData.push(data[r])
        }
      }
    }

    timetable[section] = parseMSESection(sectionData)
  }

  return timetable
}

const parseMSESection = (sectionData: any[]) => {
  const sectionTimetable: { [key: string]: Period[] } = {}
  const dayPatterns = ['MON', 'TUE', 'WED', 'THU', 'FRI']
  const dayMap: { [key: string]: string } = {
    'MON': 'Monday', 'TUE': 'Tuesday', 'WED': 'Wednesday',
    'THU': 'Thursday', 'FRI': 'Friday'
  }

  for (let i = 0; i < sectionData.length; i++) {
    const row = sectionData[i]
    const col0 = row[0]?.toString().toUpperCase().trim()
    
    const matchedDay = dayPatterns.find(day => col0?.includes(day))
    
    if (matchedDay) {
      const fullDay = dayMap[matchedDay]
      const periods = parseMSEPeriods(row)
      sectionTimetable[fullDay] = periods
    }
  }

  sectionTimetable['Saturday'] = []
  sectionTimetable['Sunday'] = []

  return sectionTimetable
}

const parseMSEPeriods = (row: any[]): Period[] => {
  const periods: Period[] = []

  const slots = [
    { time: "8:00-9:00", col: 2, endTime: "9:00" },
    { time: "9:00-10:00", col: 4, endTime: "10:00" },
    { time: "10:00-11:00", col: 6, endTime: "11:00" },
    { time: "11:00-12:00", col: 8, endTime: "12:00" },
    { time: "12:00-1:00", col: 10, endTime: "1:00" },
    { time: "1:00-2:00", col: 12, endTime: "2:00" },
    { time: "2:00-3:00", col: 14, endTime: "3:00" },
    { time: "3:00-4:00", col: 16, endTime: "4:00" },
    { time: "4:00-5:00", col: 18, endTime: "5:00" },
    { time: "5:00-6:00", col: 20, endTime: "6:00" }
  ]

  for (const slot of slots) {
    const subject = row[slot.col]?.toString().trim()

    if (!subject || subject === "" || subject === "---" || subject === "***") continue

    if (subject.toLowerCase().includes('lunch') || subject.toLowerCase().includes('break')) {
      periods.push({ time: slot.time, subject: "Break", room: "-", faculty: "-" })
      continue
    }

    if (subject === "X" || subject.toLowerCase() === "free") {
      periods.push({ time: slot.time, subject: "Free Period", room: "-", faculty: "-" })
      continue
    }

    let room = "-"
    if (subject.toLowerCase().includes('lab') || subject.toLowerCase().includes('sessional')) {
      room = "Lab"
    } else {
      room = "301"
    }

    periods.push({ time: slot.time, subject, room, faculty: "-" })
  }

  return periods
}

const parseAttendanceFile = (workbook: XLSX.WorkBook): { [key: string]: string } => {
  const sections: { [key: string]: string } = {}
  
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as any[]
    
    let detectedSection: string | null = null
    
    const sheetNameMatch = sheetName.match(/M[1-4](?![A-Z])|(?:ME|MSE|CSE|IT|CE|EE)-[A-Z0-9]+/i)
    if (sheetNameMatch) {
      detectedSection = sheetNameMatch[0].toUpperCase()
    }
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      
      for (let j = 0; j < row.length; j++) {
        const cell = row[j]?.toString().trim()
        
        if (cell && /^\d{6,10}$/.test(cell)) {
          const rollNumber = cell
          
          if (detectedSection) {
            sections[rollNumber] = detectedSection
          }
        }
      }
    }
  }
  
  return sections
}

const parseTimetable = (data: any[], semKey: string) => {
  const timetable: { [key: string]: any } = {}
  
  const dayPatterns = [
    ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
  ]

  let usedPattern = dayPatterns[0]
  for (const pattern of dayPatterns) {
    for (let i = 0; i < Math.min(50, data.length); i++) {
      const col0 = data[i][0]?.toString().toUpperCase().trim()
      if (pattern.some(day => col0?.includes(day))) {
        usedPattern = pattern.map(d => d.toUpperCase())
        break
      }
    }
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const col0 = row[0]?.toString().toUpperCase().trim()
    
    const matchedDay = usedPattern.find(day => col0?.includes(day))
    
    if (matchedDay) {
      const day = matchedDay.substring(0, 3)
      const section = row[1]?.toString().trim()

      if (!section || section === 'Section' || section === '') continue

      if (!timetable[section]) {
        timetable[section] = {}
      }

      const dayMap: { [key: string]: string } = {
        'MON': 'Monday', 'TUE': 'Tuesday', 'WED': 'Wednesday',
        'THU': 'Thursday', 'FRI': 'Friday'
      }

      const fullDay = dayMap[day] || day
      const periods = parsePeriods(row, semKey)
      timetable[section][fullDay] = periods
    }
  }

  Object.keys(timetable).forEach(sec => {
    timetable[sec]['Saturday'] = []
    timetable[sec]['Sunday'] = []
  })

  return timetable
}

const parsePeriods = (row: any[], semKey: string): Period[] => {
  const periods: Period[] = []

  const slots = [
    { time: "8:00-9:00", subject: 3, room: 2 },
    { time: "9:00-10:00", subject: 5, room: 4 },
    { time: "10:00-11:00", subject: 6, room: 4 },
    { time: "11:00-12:00", subject: 8, room: 7 },
    { time: "12:00-1:00", subject: 10, room: 9 },
    { time: "1:00-2:00", subject: 11, room: 9 },
    { time: "2:00-3:00", subject: 13, room: 12 },
    { time: "3:15-4:15", subject: 15, room: 14 },
    { time: "4:15-5:15", subject: 17, room: 16 },
    { time: "5:15-6:15", subject: 18, room: 16 }
  ]

  for (const slot of slots) {
    const subject = row[slot.subject]?.toString().trim()
    let room = row[slot.room]?.toString().trim()

    if (!subject || subject === "" || subject === "---") continue

    if (subject.toLowerCase().includes('lunch') || subject.toLowerCase().includes('break')) {
      periods.push({ time: slot.time, subject: "Break", room: "-", faculty: "-" })
      continue
    }

    if (subject === "X" || subject.toLowerCase() === "free") {
      periods.push({ time: slot.time, subject: "Free Period", room: room || "-", faculty: "-" })
      continue
    }

    if (room && room !== '-' && room !== '---') {
      const patterns = [
        /([A-Z]\d+-[A-Z]-\d+)/i,
        /([A-Z]\d+-[A-Z]\d+)/i,
        /([A-Z]-\d+)/i,
        /(Room\s*[A-Z]?\d+)/i,
        /([A-Z]\d+)/i,
        /(\d{3,})/
      ]

      for (const pattern of patterns) {
        const match = room.match(pattern)
        if (match) {
          room = match[1]
          break
        }
      }
    } else {
      room = "-"
    }

    periods.push({ time: slot.time, subject, room: room || "-", faculty: "-" })
  }

  return periods
}

const parseSections = (data: any[]): { [key: string]: string } => {
  const sections: { [key: string]: string } = {}

  for (let i = 0; i < data.length; i++) {
    const row = data[i]

    if (row[0] && row[1]) {
      const rawRoll = row[0].toString().trim()
      const section = row[1].toString().trim()

      const { raw, digits } = normalizeRoll(rawRoll)

      if (raw.match(/^\d{6,10}$/)) {
        sections[raw] = section
        if (digits && digits !== raw) sections[digits] = section
      }
    }
  }

  return sections
}

const normalizeSectionName = (section: string): string => {
  if (!section) return section
  
  if (/^M[1-4]$/.test(section)) return section
  
  return section
    .replace(/CSCE-0?/, 'CSCE-')
    .replace(/CSE-0/, 'CSE-')
    .replace(/IT-0/, 'IT-')
    .replace(/(\D+)0+(\d+)/, '$1$2')
}

const findSectionInTimetable = (timetable: any, section: string) => {
  const normalizedSection = normalizeSectionName(section)
  
  let sectionTT = timetable[section] || timetable[normalizedSection]
  
  if (!sectionTT) {
    const exactMatch = Object.keys(timetable).find(
      key => key.toLowerCase() === section.toLowerCase()
    )
    if (exactMatch) {
      sectionTT = timetable[exactMatch]
    }
  }

  if (!sectionTT) {
    const cleanSection = section.replace(/[-\s]/g, '').toLowerCase()
    const fuzzyMatch = Object.keys(timetable).find(
      key => key.replace(/[-\s]/g, '').toLowerCase() === cleanSection
    )
    if (fuzzyMatch) {
      sectionTT = timetable[fuzzyMatch]
    }
  }

  return sectionTT
}

const detectBranchFromSection = (section: string): string | null => {
  const s = section.toUpperCase()
  if (/M[1-4](?![A-Z])/.test(s) || s.includes('ME-') || s.includes('MSE')) {
    return 'mse4'
  }
  return null
}

export const getTodayTimetable = async (input: string) => {
  let { sections, timetable, semKey } = await parseExcelFiles(input)
  let section: string | undefined

  if (input.includes('|')) {
    const [year, sec] = input.split('|')
    section = sec.trim()
    
    const branch = detectBranchFromSection(section)
    if (branch && branch !== semKey) {
      const newData = await parseExcelFiles(section)
      sections = newData.sections
      timetable = newData.timetable
      semKey = newData.semKey
    }
  } else {
    const { raw: lookupRaw, digits: lookupDigits } = normalizeRoll(input)
    section = sections[lookupRaw] || sections[lookupDigits]
    
    if (section) {
      const branch = detectBranchFromSection(section)
      if (branch && branch !== semKey) {
        const newData = await parseExcelFiles(section)
        sections = newData.sections
        timetable = newData.timetable
        semKey = newData.semKey
      }
    }
  }

  if (!section) {
    throw new Error("Section not found. Please check your roll number or year+section.")
  }

  const sectionTT = findSectionInTimetable(timetable, section)

  if (!sectionTT) {
    throw new Error(`Section ${section} not found in timetable`)
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = days[new Date().getDay()] || "Monday"

  const todaySchedule = sectionTT[today] || []

  if (todaySchedule.length === 0) {
    return {
      day: today,
      section: normalizeSectionName(section),
      timetable: [],
      message: "No classes today. Enjoy your break! 🎉"
    }
  }

  return { day: today, section: normalizeSectionName(section), timetable: todaySchedule }
}

export const getFullWeekTimetable = async (input: string) => {
  let { sections, timetable, semKey } = await parseExcelFiles(input)
  let section: string | undefined

  if (input.includes('|')) {
    const [year, sec] = input.split('|')
    section = sec.trim()
    
    const branch = detectBranchFromSection(section)
    if (branch && branch !== semKey) {
      const newData = await parseExcelFiles(section)
      sections = newData.sections
      timetable = newData.timetable
      semKey = newData.semKey
    }
  } else {
    const { raw: lookupRaw, digits: lookupDigits } = normalizeRoll(input)
    section = sections[lookupRaw] || sections[lookupDigits]
    
    if (section) {
      const branch = detectBranchFromSection(section)
      if (branch && branch !== semKey) {
        const newData = await parseExcelFiles(section)
        sections = newData.sections
        timetable = newData.timetable
        semKey = newData.semKey
      }
    }
  }

  if (!section) {
    throw new Error("Section not found. Please check your roll number or year+section.")
  }

  const fullTimetable = findSectionInTimetable(timetable, section)

  if (!fullTimetable) {
    throw new Error(`Section ${section} not found in timetable`)
  }

  return { section: normalizeSectionName(section), fullTimetable }
}