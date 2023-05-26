import {
  Loading,
  QSpinnerHourglass
} from 'quasar'
import { i18n } from 'boot/i18n'
import { useNotify } from 'composables/notify'

export function useLoading () {
  const { t } = i18n.global
  const notify = useNotify()

  let dismissNotify

  return {
    async start (fn, opts = {}) {
      dismissNotify && dismissNotify()

      if (!opts.silent) {
        Loading.show({
          message: opts.message || t('labels.loading'),
          spinner: QSpinnerHourglass
        })
      }

      try {
        const result = await fn()

        if (opts.successMessage) {
          notify({
            message: opts.successMessage,
            type: 'positive'
          })
        }

        return result
      } catch (error) {
        dismissNotify = notify({
          message: opts.errorMessage || error.message,
          type: 'negative',
          timeout: 0
        })
        throw error
      } finally {
        if (!opts.silent) {
          this.stop()
        }
      }
    },
    stop () {
      Loading.hide()
    }
  }
}
