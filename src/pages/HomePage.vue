<template lang='pug'>
q-page(padding)
  h1.text-center.q-my-md {{ t('labels.welcome') }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
