import { Dict } from '@/types'

const numberCallMap: Dict<(...args: any[]) => any> = {
  MAX: (...args) => Math.max(...args.map(Number)),
  MIN: (...args) => Math.min(...args.map(Number)),
  AVG: (...args) => {
    const nums = args.map(Number)
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
  },
  SUM: (...args) => args.map(Number).reduce((a, b) => a + b, 0),
  ROUND: (num, digits = 0) =>
    Number(Math.round(Number(Number(num) + 'e' + digits)) + 'e-' + digits),
  TRUNCATE: (num, digits = 0) => {
    const n = Number(num)
    const factor = Math.pow(10, digits)
    return Math.trunc(n * factor) / factor
  },
  POWER: (base, exp) => Math.pow(Number(base), Number(exp)),
  ABS: (num) => Math.abs(Number(num)),
  MOD: (a, b) => Number(a) % Number(b),
  RANDOM: (min = 0, max = 1) =>
    Math.random() * (Number(max) - Number(min)) + Number(min),
  TOSTRING: (num) => Number(num).toString(),
}

const dateCallMap: Dict<(...args: any[]) => any> = {
  NOW: () => new Date(),
  TODAY: () => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  },
  DATESTR: (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().slice(0, 10)
  },
  EXTRACT: (date, part) => {
    const d = new Date(date)
    switch (part) {
      case 'year':
        return d.getFullYear()
      case 'month':
        return d.getMonth() + 1
      case 'day':
        return d.getDate()
      case 'hour':
        return d.getHours()
      case 'minute':
        return d.getMinutes()
      case 'second':
        return d.getSeconds()
      default:
        return null
    }
  },
  DATEDELTA: (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24))
  },
  DATEADD: (date, days) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
  },
  MONTHDAYS: (date) => {
    const d = new Date(date)
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  },
  DAYOFYEAR: (date) => {
    const d = new Date(date)
    const start = new Date(d.getFullYear(), 0, 0)
    const diff = d.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  },
  WEEKOFYEAR: (date) => {
    const d = new Date(date)
    // 使用本地日期，避免时区问题
    d.setHours(0, 0, 0, 0)
    const start = new Date(d.getFullYear(), 0, 1)
    start.setHours(0, 0, 0, 0)
    const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86400000) + 1
    const startDayOfWeek = start.getDay()
    // 第一周从1月1日所在的周开始
    return Math.ceil((dayOfYear + startDayOfWeek) / 7)
  },
  DATE: (year, month, day) => new Date(year, month - 1, day),
  WEEKDAYNUM: (date) => {
    const d = new Date(date)
    return d.getDay()
  },
  WEEKDAYSTR: (date) => {
    const d = new Date(date)
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
  },
  MONTHSTART: (date) => {
    const d = new Date(date)
    d.setDate(1)
    return d
  },
  MONTHEND: (date) => {
    const d = new Date(date)
    d.setMonth(d.getMonth() + 1, 0)
    return d
  },
  TIMESTAMPFORMAT: (date, fmt = 'yyyy-MM-dd HH:mm:ss') => {
    const d = new Date(date)
    const pad = (n) => n.toString().padStart(2, '0')
    return fmt
      .replace('yyyy', d.getFullYear().toString())
      .replace('MM', pad(d.getMonth() + 1))
      .replace('dd', pad(d.getDate()))
      .replace('HH', pad(d.getHours()))
      .replace('mm', pad(d.getMinutes()))
      .replace('ss', pad(d.getSeconds()))
  },
}

const textCallMap: Dict<(...args: any[]) => any> = {
  CONCAT: (...args) => args.join(''),
  REPLACE: (text, search, replace) =>
    text.replace(new RegExp(search, 'g'), replace),
  INSERT: (text, insert, pos) => text.slice(0, pos) + insert + text.slice(pos),
  LEFT: (text, n) => text.slice(0, n),
  RIGHT: (text, n) => text.slice(-n),
  MID: (text, start, len) => text.substr(start, len),
  LEN: (text) => text.length,
  TRIM: (text) => text.trim(),
  LOCATE: (search, text) => text.indexOf(search),
  IDCARDBIRTHDAY: (id: string) => {
    try {
      let year: number, month: number, day: number | undefined
      if (id.length === 18) {
        year = Number(id.substr(6, 4))
        month = Number(id.substr(10, 2))
        day = Number(id.substr(12, 2))
      } else if (id.length === 15) {
        year = Number(id.substr(6, 2)) + 1900
        month = Number(id.substr(8, 2))
        day = Number(id.substr(10, 2))
      } else {
        return ''
      }
      // 校验日期合法性
      const date = new Date(year, month - 1, day)
      if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
      ) {
        return ''
      }
      // 格式化 YYYY-MM-DD
      const pad = (n: number) => n.toString().padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    } catch {
      return ''
    }
  },
  IDCARDSEX: (id: string) => {
    try {
      if (id.length === 18) {
        return Number(id.substr(16, 1)) % 2 === 0 ? '女' : '男'
      }

      if (id.length === 15) {
        return Number(id.substr(14, 1)) % 2 === 0 ? '女' : '男'
      }

      return ''
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return ''
    }
  },
  TONUMBER: (text) => Number(text),
}

const logicCallMap: Dict<(...args: any[]) => any> = {
  IF: (cond, valTrue, valFalse) => (cond ? valTrue : valFalse),
  IFS: (...args) => {
    for (let i = 0; i < args.length; i += 2) {
      if (args[i]) return args[i + 1]
    }
    return undefined
  },
  AND: (...args) => args.every(Boolean),
  OR: (...args) => args.some(Boolean),
  EMPTY: (val) => val == null || val === '',
  ISEMPTY: (val) => val == null || val === '',
  ISNOTEMPTY: (val) => !(val == null || val === ''),
  EMPTYSTR: () => '',
  DEFAULTVALUE: (val, def) => (val == null || val === '' ? def : val),
}

export const callMap = {
  ...numberCallMap,
  ...dateCallMap,
  ...textCallMap,
  ...logicCallMap,
}
