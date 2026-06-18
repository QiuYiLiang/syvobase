import { describe, it, expect, beforeEach } from 'vitest'
import { locale, $t } from '../i18n'

describe('i18n 国际化函数', () => {
  describe('locale 设置语言数据', () => {
    beforeEach(() => {
      // 重置为中文语言数据
      locale({
        common: {
          confirm: '确认',
          cancel: '取消',
          save: '保存',
        },
        button: {
          submit: '提交',
          reset: '重置',
        },
        nested: {
          level1: {
            level2: {
              value: '嵌套值',
            },
          },
        },
      })
    })

    it('应该能够设置语言数据', () => {
      locale({
        test: {
          key: 'value',
        },
      })
      expect($t('test.key')).toBe('value')
    })

    it('应该覆盖之前的语言数据', () => {
      locale({
        common: {
          confirm: '确认旧',
        },
      })
      locale({
        common: {
          confirm: '确认新',
        },
      })
      expect($t('common.confirm')).toBe('确认新')
    })
  })

  describe('$t 翻译函数', () => {
    beforeEach(() => {
      locale({
        common: {
          confirm: '确认',
          cancel: '取消',
          save: '保存',
          empty: '',
        },
        button: {
          submit: '提交',
          reset: '重置',
        },
        nested: {
          level1: {
            level2: {
              value: '嵌套值',
            },
          },
        },
        special: {
          withNumber: '数量: 100',
          withHtml: '<span>HTML内容</span>',
        },
        '40b41ee0-977c-49e8-9056-d32c9cef0cdd': '取消',
        'cffc1b2b-0a1a-4d76-9c1c-07b4214c5a7f': '保存',
      })
    })

    describe('基础翻译', () => {
      it('应该返回匹配的翻译值', () => {
        expect($t('common.confirm')).toBe('确认')
        expect($t('40b41ee0-977c-49e8-9056-d32c9cef0cdd')).toBe('取消')
        expect($t('cffc1b2b-0a1a-4d76-9c1c-07b4214c5a7f')).toBe('保存')
      })

      it('应该处理不同模块的键', () => {
        expect($t('button.submit')).toBe('提交')
        expect($t('button.reset')).toBe('重置')
      })
    })

    describe('嵌套键访问', () => {
      it('应该支持深层嵌套键', () => {
        expect($t('nested.level1.level2.value')).toBe('嵌套值')
      })

      it('应该返回 undefined 对于不存在的嵌套键', () => {
        expect($t('nested.level1.notExist')).toBeUndefined()
      })
    })

    describe('默认值处理', () => {
      it('应该在键不存在时返回默认值', () => {
        expect($t('notExist.key', '默认值')).toBe('默认值')
      })

      it('应该在键存在时忽略默认值', () => {
        expect($t('common.confirm', '默认值')).toBe('确认')
      })

      it('应该在嵌套键不存在时返回默认值', () => {
        expect($t('a.b.c.d.e', '深层默认值')).toBe('深层默认值')
      })

      it('应该返回 undefined 当键不存在且没有默认值时', () => {
        expect($t('notExist.key')).toBeUndefined()
      })
    })

    describe('特殊值处理', () => {
      it('应该处理空字符串值', () => {
        expect($t('common.empty')).toBe('')
      })

      it('应该处理包含数字的值', () => {
        expect($t('special.withNumber')).toBe('数量: 100')
      })

      it('应该处理包含 HTML 的值', () => {
        expect($t('special.withHtml')).toBe('<span>HTML内容</span>')
      })
    })

    describe('边界情况', () => {
      it('应该处理空字符串键', () => {
        expect($t('')).toBeUndefined()
      })

      it('应该处理只有点的键', () => {
        expect($t('.')).toBeUndefined()
        expect($t('..')).toBeUndefined()
      })

      it('应该处理以点开头或结尾的键', () => {
        expect($t('.common')).toBeUndefined()
        expect($t('common.')).toBeUndefined()
      })

      it('应该处理顶级键', () => {
        locale({
          topLevel: '顶级值',
        })
        expect($t('topLevel')).toBe('顶级值')
      })
    })
  })

  describe('多语言切换场景', () => {
    it('应该支持中英文切换', () => {
      // 设置中文
      locale({
        greeting: '你好',
      })
      expect($t('greeting')).toBe('你好')

      // 切换到英文
      locale({
        greeting: 'Hello',
      })
      expect($t('greeting')).toBe('Hello')
    })

    it('应该支持复杂语言数据结构', () => {
      locale({
        menu: {
          file: {
            new: '新建',
            open: '打开',
            save: '保存',
            saveAs: '另存为',
          },
          edit: {
            undo: '撤销',
            redo: '重做',
            cut: '剪切',
            copy: '复制',
            paste: '粘贴',
          },
        },
      })

      expect($t('menu.file.new')).toBe('新建')
      expect($t('menu.file.saveAs')).toBe('另存为')
      expect($t('menu.edit.undo')).toBe('撤销')
      expect($t('menu.edit.paste')).toBe('粘贴')
    })
  })
})
