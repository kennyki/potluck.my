<template lang='pug'>
q-btn(
  v-if='userStore.isLoggedIn'
  flat
  icon='account_circle'
  no-caps
  )
  .q-pl-xs {{ userStore.account.name }}
  q-icon(
    name='arrow_drop_down'
    size='xs'
    )
  q-menu(auto-close)
    q-list
      q-item(
        clickable
        @click='logout()'
        )
        q-item-section.text-negative(no-wrap) {{ t('actions.deleteProfile') }}
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useLoading } from 'composables/loading'
import { useUserStore } from 'stores/user'

const $q = useQuasar()
const { t } = useI18n()
const loading = useLoading()
const userStore = useUserStore()
const router = useRouter()

function logout () {
  $q.dialog({
    class: 'text-negative',
    color: 'negative',
    title: t('actions.deleteProfile'),
    message: t('prompts.deleteProfile'),
    ok: {
      label: t('labels.yes'),
      flat: false
    },
    cancel: t('labels.no')
  }).onOk(async () => {
    await loading.start(() => userStore.logout())
    router.replace({ name: 'home' })
  })
}
</script>
