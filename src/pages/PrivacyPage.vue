<template lang='pug'>
q-card(
  flat
  bordered
  )
  q-card-section
    h1.text-h5.text-center.q-mt-none.q-mb-sm {{ t('privacyPolicy.title') }}
    .prose(v-html='t("privacyPolicy.content")')
</template>

<script setup>
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useMeta({
  title: t('privacyPolicy.title')
})
</script>
