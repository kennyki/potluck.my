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
import { useEventStore } from 'stores/event'
import { useLoading } from 'composables/loading'
import { useRouter } from 'vue-router'
import EventForm from 'components/EventForm.vue'

const { t } = useI18n()
const eventStore = useEventStore()
const loading = useLoading()
const router = useRouter()

async function onSubmit (params) {
  const id = await loading.start(() => eventStore.create(params))

  router.push({
    name: 'eventView',
    params: { id }
  })
}

function onCancel () {
  router.replace({ name: 'home' })
}
</script>
