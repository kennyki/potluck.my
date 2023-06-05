<template lang='pug'>
q-dialog(
  ref='dialogRef'
  @hide='onDialogHide'
  )
  q-card.q-dialog-plugin
    q-card-section.row.items-center
      .text-h6 {{ title }}
      q-space
      q-btn(
        icon='close'
        flat
        round
        dense
        v-close-popup
        )
    q-card-section
      ItemForm(
        :data='data'
        @submit='onDialogOK($event)'
        @cancel='onDialogHide()'
        )
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'
import ItemForm from 'components/ItemForm.vue'

defineEmits([
  ...useDialogPluginComponent.emits
])

const props = defineProps({
  data: {
    type: Object
  }
})

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
const { t } = useI18n()

const title = props.data ? t('actions.edit') : t('actions.add')
</script>
