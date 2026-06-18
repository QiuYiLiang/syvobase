type FunctionOrReturn<F extends (...arg: any) => any> = F | ReturnType<F>

export async function execFunctionOrReturn(
  functionOrReturn: FunctionOrReturn<any>,
  ...args: any
) {
  const isFunction = typeof functionOrReturn === 'function'
  return !isFunction ? functionOrReturn : await functionOrReturn(...args)
}
