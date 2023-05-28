<template lang='pug'>
q-card(
  flat
  bordered
  )
  q-card-section
    h1.text-h5.text-center.q-my-none {{ t('actions.createEvent') }}
    EventForm(
      @submit='onSubmit($event)'
      @cancel='onCancel()'
      )
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function onSubmit () {}

function onCancel () {}
</script>
