import dayjs from 'dayjs'
const FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function formatDate(date: any, format: string = FORMAT) {
  return dayjs(date).format(format)
}

export function toDate(date: any) {
  return dayjs(date)
}
