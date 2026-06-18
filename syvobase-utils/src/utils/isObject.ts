export function isObject(value: any) {
  return !Array.isArray(value) && typeof value === 'object' && value !== null
}
