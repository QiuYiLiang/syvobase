import { Dict } from '@syvobase/utils'
import { Theme, ThemeVars } from './shared'
export * from './shared'
export * from '../syvobaseUI/context'
export * from './hooks'

const themes: Dict<Theme> = {}

const jsonModules: Dict<Dict> = import.meta.glob('./defines/*.json', {
  eager: true,
})

function toThemeVars(json: Dict): ThemeVars {
  return Object.keys(json).reduce((ret, key) => {
    // 生成 CSS 变量名 (e.g., primary-foreground -> --syvobase-primary-foreground)
    ret[`--syvobase-${key}` as keyof ThemeVars] = json[key]
    return ret
  }, {} as ThemeVars)
}

for (const path in jsonModules) {
  const jsonData = jsonModules[path].default
  themes[jsonData.name] = {
    light: toThemeVars(jsonData.cssVars.light),
    dark: toThemeVars(jsonData.cssVars.dark),
    common: toThemeVars(jsonData.cssVars.theme),
  }
}

export { themes }
