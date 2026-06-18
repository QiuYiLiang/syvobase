import { Dict } from '../types'

export function keysToMap(keys: string[]) {
  return keys.reduce((ret, key) => {
    ret[key] = true
    return ret
  }, {} as Dict<boolean>)
}
