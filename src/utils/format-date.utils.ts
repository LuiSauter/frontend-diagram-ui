export function FormatDateMMMD(dateString: string): string { // date to '15 feb'
  const date = new Date(dateString)
  return `${date.getDate()} ${date.toLocaleDateString('es-BO', { month: 'short' })}`
}

export function FormatDateMMMDYYYY(dateString: string): string {
  const date = new Date(dateString)
  const currentYear = new Date().getFullYear()
  const year = date.getFullYear()
  return year === currentYear ? FormatDateMMMD(dateString) : `${FormatDateMMMD(dateString)} ${year}`
}

export function calculateElapsedTime(createdAt: string | any): string { // date to 'hace 2 horas'
  const currentDate: Date = new Date()
  const creationDate: Date = new Date(String(createdAt))

  const timeDifference: number = currentDate.getTime() - creationDate.getTime()

  const millisecondsInSecond: number = 1000
  const millisecondsInMinute: number = millisecondsInSecond * 60
  const millisecondsInHour: number = millisecondsInMinute * 60
  const millisecondsInDay: number = millisecondsInHour * 24
  const millisecondsInMonth: number = millisecondsInDay * 30 // 30 days in a month
  const millisecondsInYear: number = millisecondsInDay * 365 // 365 days in a year

  const elapsedMinutes: number = Math.floor(timeDifference / millisecondsInMinute)
  const elapsedHours: number = Math.floor(timeDifference / millisecondsInHour)
  const elapsedDays: number = Math.floor(timeDifference / millisecondsInDay)
  const elapsedMonths: number = Math.floor(timeDifference / millisecondsInMonth)
  const elapsedYears: number = Math.floor(timeDifference / millisecondsInYear)

  if (elapsedYears > 0) {
    return `hace ${elapsedYears} ${elapsedYears === 1 ? 'año' : 'años'}`
  } else if (elapsedMonths > 0) {
    return `hace ${elapsedMonths} ${elapsedMonths === 1 ? 'mes' : 'meses'}`
  } else if (elapsedDays > 0) {
    return `hace ${elapsedDays} ${elapsedDays === 1 ? 'dia' : 'días'}`
  } else if (elapsedHours > 0) {
    return `hace ${elapsedHours} ${elapsedHours === 1 ? 'hora' : 'horas'}`
  } else {
    return `hace ${elapsedMinutes} ${elapsedMinutes === 1 ? 'minuto' : 'minutos'}`
  }
}

export function calculateTimeToEvent(dateString: string): string { // date to 'en 2 horas'
  const currentDate: Date = new Date()
  const eventDate: Date = new Date(dateString)

  const timeDifference: number = eventDate.getTime() - currentDate.getTime()

  const millisecondsInSecond: number = 1000
  const millisecondsInMinute: number = millisecondsInSecond * 60
  const millisecondsInHour: number = millisecondsInMinute * 60
  const millisecondsInDay: number = millisecondsInHour * 24
  const millisecondsInMonth: number = millisecondsInDay * 30 // 30 days in a month
  const millisecondsInYear: number = millisecondsInDay * 365 // 365 days in a year

  const elapsedMinutes: number = Math.floor(timeDifference / millisecondsInMinute)
  const elapsedHours: number = Math.floor(timeDifference / millisecondsInHour)
  const elapsedDays: number = Math.floor(timeDifference / millisecondsInDay)
  const elapsedMonths: number = Math.floor(timeDifference / millisecondsInMonth)
  const elapsedYears: number = Math.floor(timeDifference / millisecondsInYear)

  if (elapsedYears > 0) {
    return `En ${elapsedYears} ${elapsedYears === 1 ? 'año' : 'años'}`
  } else if (elapsedMonths > 0) {
    return `En ${elapsedMonths} ${elapsedMonths === 1 ? 'mes' : 'meses'}`
  } else if (elapsedDays > 0) {
    return `En ${elapsedDays} ${elapsedDays === 1 ? 'dia' : 'dias'}`
  } else if (elapsedHours > 0) {
    return `En ${elapsedHours} ${elapsedHours === 1 ? 'hora' : 'horas'}`
  } else if (elapsedMinutes > 0) {
    return `En ${elapsedMinutes} ${elapsedMinutes === 1 ? 'minuto' : 'minutos'}`
  } else {
    return 'Expirado'
  }
}

export const extractDate = (date: string) => { // '15/02/2021' to 'Mon Feb 15 2021'
  const dateParts = date.split('/')
  const day = parseInt(dateParts[0], 10)
  const month = parseInt(dateParts[1], 10) - 1
  const year = parseInt(dateParts[2], 10)
  return new Date(year, month, day).toDateString()
}

// Date to date hour: 15 feb 2021 15:30
export function FormatDateMMMDYYYYHHMM(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getDate()} ${date.toLocaleDateString('es-BO', { month: 'short' })} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
}

// date to 'febrero'
export function FormatDateMMMM(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-BO', { month: 'long' })
}

// extraer la fecha de esta cadena de texto "28/04/2025 09:17 a. m." para obtenerlo en tipo Date
export function extractDateTime(dateString: string): Date {
  const [datePart, timePart] = dateString.split(' ')
  const [day, month, year] = datePart.split('/')
  const [time, period] = timePart.split(' ')
  const [hours, minutes] = time.split(':')
  let formattedHours = parseInt(hours, 10)
  if (period === 'p. m.' && formattedHours !== 12) {
    formattedHours += 12
  } else if (period === 'a. m.' && formattedHours === 12) {
    formattedHours = 0
  }

  const formattedDate = new Date(`${year}/${month}/${day} ${formattedHours}:${minutes}:00`)
  return formattedDate
}
