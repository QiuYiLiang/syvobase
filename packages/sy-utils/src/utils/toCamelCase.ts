export function toCamelCase(str: string) {
  return str
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (t, e) {
      return 0 === e ? t.toLowerCase() : t.toUpperCase()
    })
    .replace(/\s+/g, '')
}
