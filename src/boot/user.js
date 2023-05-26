import { boot } from 'quasar/wrappers'
import { i18n } from 'boot/i18n'
import { useUserStore } from 'stores/user'
import { useNotify } from 'composables/notify'

export default boot(async ({ app, router }) => {
  const userStore = useUserStore()
  const { t } = i18n.global
  const notify = useNotify()

  try {
    await userStore.init()
    console.log(userStore.isLoggedIn ? 'Is user' : 'Is guest')
  } catch (error) {
    notify(t('auth.initError'))
    console.error(error)
  }
})
