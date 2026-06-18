export function generateRandomString(length = 4, prefix = '') {
  if (length <= 0) return ''

  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const allChars = letters + '0123456789'

  let result = letters.charAt(Math.floor(Math.random() * letters.length))

  for (let i = 1; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }

  if (prefix) {
    return `${prefix}_${result}`
  }
  return result
}
