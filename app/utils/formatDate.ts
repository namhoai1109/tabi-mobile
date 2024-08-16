export const quantityDateBetween2Date = (date1: string, date2: string) => {
  const date1Obj = new Date(date1)
  const date2Obj = new Date(date2)
  const timeDiff = Math.abs(date2Obj.getTime() - date1Obj.getTime())
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

export function getTimeHourAndMinute(timeString: string): string {
  const date = new Date(timeString)
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

export const getDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
  const day = date.getUTCDate().toString().padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const formatDateStringForCalendarPickerPlaceholder = (date: Date, isEn: boolean) => {
  const options = {
    weekday: "short" as const,
    month: "short" as const,
    day: "numeric" as const,
    year: "numeric" as const,
  }
  if (date) {
    if (isEn) return date.toLocaleDateString("en-US", options)
    else return date.toLocaleDateString("vi-VN", options)
  }
  return date
}

export const formatDateString = (date: Date, isEn: boolean) => {
  const options = {
    month: "short" as const,
    day: "numeric" as const,
    year: "numeric" as const,
  }
  if (date) {
    if (isEn) return date.toLocaleDateString("en-US", options)
    else return date.toLocaleDateString("vi-VN", options)
  }
  return date
}

export const calculateDurationInDays = (startDate: Date, endDate: Date) => {
  // Convert both dates to milliseconds
  const startMillis = startDate.getTime()
  const endMillis = endDate.getTime()

  // Calculate the difference in milliseconds
  const differenceMillis = Math.abs(endMillis - startMillis)

  // Convert milliseconds to days
  const days = Math.ceil(differenceMillis / (1000 * 60 * 60 * 24))

  return days
}

export const getDatesBetween2Dates = (startDate: string, endDate: string) => {
  const dates = []
  startDate = startDate.split("T")[0]
  endDate = endDate.split("T")[0]
  let currentDate = new Date(startDate)
  const endDateObj = new Date(endDate)

  while (currentDate <= endDateObj) {
    dates.push(currentDate)
    currentDate = new Date(currentDate)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}
