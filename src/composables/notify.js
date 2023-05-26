import { Notify } from 'quasar'
import { i18n } from 'boot/i18n'

export function useNotify () {
  const { t } = i18n.global

  return function notify (message) {
    const opts = {
      progress: true,
      timeout: 3000,
      actions: [
        {
          label: t('actions.dismiss'),
          handler: () => dismiss()
        }
      ]
    }

    if (typeof message === 'object') {
      Object.assign(opts, message)
    } else {
      opts.message = message
    }

    const dismiss = Notify.create(opts)

    return dismiss
  }
}
