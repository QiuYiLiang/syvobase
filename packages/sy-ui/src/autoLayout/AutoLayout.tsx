import { AutoLayoutEditor } from './AutoLayoutEditor'
import { AutoLayoutMobile } from './AutoLayoutMobile'
import { AutoLayoutPC } from './AutoLayoutPC'
import { AutoLayoutProps } from './shared'

export const AutoLayout = (props: AutoLayoutProps) => {
  const { renderType = 'pc', readMode = false } = props
  const {
    value: _value,
    defaultValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChange: _onChange,
    ...readModeProps
  } = props
  if (readMode) {
    if (renderType === 'pc') {
      return (
        <AutoLayoutPC
          {...readModeProps}
          defaultValue={_value || defaultValue}
        />
      )
    }
    if (renderType === 'mobile') {
      return (
        <AutoLayoutMobile
          {...readModeProps}
          defaultValue={_value || defaultValue}
        />
      )
    }
  } else {
    return <AutoLayoutEditor {...props} />
  }
}
