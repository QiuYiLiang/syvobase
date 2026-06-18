import { ComponentType, lazy as ReactLazy } from 'react'

export const lazy = <T extends object, U extends keyof T>(
  loader: (x?: string) => Promise<T>
) =>
  new Proxy({} as unknown as T, {
    get: (_, componentName: string | symbol) => {
      if (typeof componentName === 'string') {
        return ReactLazy(() =>
          loader(componentName).then((x) => ({
            default: x[componentName as U] as any as ComponentType<any>,
          }))
        )
      }
    },
  })
