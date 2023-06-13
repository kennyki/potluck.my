<template lang='pug'>
q-card(
  flat
  bordered
  )
  q-card-section
    h1.text-h5.text-center.q-my-none {{ t('labels.credits') }}
    .flex.justify-center
      ul
        li
          | {{ t('labels.logo') }}:
          a.q-ml-xs(
            href='https://www.flaticon.com/free-icons/pot'
            title='pot icons'
            target='_blank'
          ) Pot icons created by Freepik - Flaticon
        li
          | {{ t('labels.backend') }}:
          a.q-ml-xs(
            href='https://appwrite.io'
            target='_blank'
          ) Appwrite
        li
          | {{ t('labels.frontend') }}:
          a.q-ml-xs(
            href='https://quasar.dev'
            target='_blank'
          ) Quasar
</template>

<script setup>
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useMeta({
  title: t('labels.credits')
})
</script>
