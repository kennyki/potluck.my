<template lang='pug'>
q-card(
  flat
  bordered
  )
  q-card-section
    h1.text-h5.text-center.q-my-none {{ t('home.tagline') }}
    .flex.justify-center
      ul
        li {{ t('home.benefit1') }}
        li {{ t('home.benefit2') }}
        li {{ t('home.benefit3') }}
        li {{ t('home.benefit4') }}
q-card.q-my-lg(
  flat
  bordered
  )
  q-card-section
    h5.text-center.q-my-none {{ t('home.howItWork') }}
    .flex.justify-center
      ol
        li {{ t('home.step1') }}
        li {{ t('home.step2') }}
        li {{ t('home.step3') }}
        li {{ t('home.step4') }}
.flex.justify-center
  q-btn(
    push
    no-caps
    color='primary'
    :label='t("actions.getStarted")'
    :to='{ name: "eventCreation" }'
    )
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
