<template lang='pug'>
q-card(
  flat
  bordered
  )
  q-card-section
    h1.text-h5.text-center.q-mt-none.q-mb-sm {{ t('privacyPolicy.title') }}
    .content(v-html='t("privacyPolicy.content")')
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang='scss'>
.content {
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 8px;
  }
}
</style>
