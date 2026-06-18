import { locale as _locale } from '@/utils/i18n'
import { Dict } from '@syvobase/utils'

const modules = import.meta.glob('./*.json', { eager: true })

export const languageDataMap: Dict = {}

for (const path in modules) {
  const lang = path.match(/\.\/(.*)\.json$/)?.[1]
  if (lang) {
    languageDataMap[lang] = (modules[path] as any).default ?? modules[path]
  }
}

export const locale = _locale
