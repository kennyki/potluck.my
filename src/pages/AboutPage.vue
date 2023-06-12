<template lang='pug'>
q-card(
  flat
  bordered
  )
  q-card-section
    h1.text-h5.text-center.q-mt-none.q-mb-sm {{ t('about.title') }}
    .prose(v-html='t("about.content")')
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
