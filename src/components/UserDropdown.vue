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
    size='16px'
    )
  q-menu(auto-close)
    q-list
      q-item(
        clickable
        @click='logout()'
        )
        q-item-section(no-wrap) {{ t('actions.deleteProfile') }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user'

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

async function logout () {
  await userStore.logout()
  router.push({ name: 'home' })
}
</script>
