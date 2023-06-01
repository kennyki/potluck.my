<template lang='pug'>
q-dialog(
  ref='dialogRef'
  @hide='onDialogHide'
  )
  q-card.q-dialog-plugin
    q-card-section.row.items-center
      .text-h6 {{ t('labels.event') }}
      q-space
      q-btn(
        icon='close'
        flat
        round
        dense
        v-close-popup
        )
    q-card-section
      EventForm(
        :data='data'
        @submit='onSubmit($event)'
        @cancel='onDialogHide()'
        )
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useEventStore } from 'stores/event'
import { useLoading } from 'composables/loading'
import EventForm from 'components/EventForm.vue'

defineEmits([
  ...useDialogPluginComponent.emits
])

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
const { t } = useI18n()
const eventStore = useEventStore()
const loading = useLoading()

async function onSubmit (params) {
  const result = await loading.start(() => eventStore.updateMetadata(params))

  onDialogOK(result)
}
</script>
