export function strToArray(value: any = '', splitter = ',') {
  if (value === '' || value === null) {
    return []
  }
  return value.split(splitter)
}
