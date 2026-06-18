import { get, Dict } from '@syvobase/utils'
import { languageDataMap } from '@/locales'

let _languageData: Dict = languageDataMap['zh-CN']
let _currentLanguage = 'zh-CN'

export function locale(lang: string, languageData?: Dict) {
  _currentLanguage = lang
  _languageData = languageData ?? languageDataMap[lang] ?? _languageData
}

export function getCurrentLanguage() {
  return _currentLanguage
}

export function $t(key: string, defaultValue?: string) {
  return get(_languageData, key, defaultValue)
}
