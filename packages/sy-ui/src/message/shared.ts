import { toast } from 'sonner'

export const message = {
  notify: (...args: Parameters<typeof toast>) => {
    const options = args[1]
    if (typeof options === 'object' && !options.position) {
      options.position = 'top-right'
    }
    toast(...args)
  },
  success: toast.success.bind(toast),
  info: toast.info.bind(toast),
  warning: toast.warning.bind(toast),
  error: toast.error.bind(toast),
  custom: toast.custom.bind(toast),
  message: toast.message.bind(toast),
  loading: toast.loading.bind(toast),
  dismiss: toast.dismiss.bind(toast),
}
