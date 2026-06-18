import { Dict } from '@syvobase/utils'

export function mergeTag(tagName: string, props: Dict = {}) {
  return {
    'data-tag': props['data-tag'] || `nk-${tagName}`,
  }
}
