<template lang='pug'>
q-form.q-gutter-sm(@submit='onSubmit()')
  q-input(
    v-model='state.title'
    :label='t("labels.itemTitle") + " *"'
    bottom-slots
    :error='v.title.$error'
    )
    template(v-slot:error)
      ValidationMessages(:errors='v.title.$errors')
  .q-mt-lg
    q-btn(
      type='submit'
      push
      no-caps
      color='primary'
      :label='t("actions.submit")'
      )
    q-btn.q-ml-sm(
      type='button'
      push
      no-caps
      :label='t("actions.cancel")'
      @click='$emit("cancel")'
      )
</template>

<script setup>
import { reactive } from 'vue'
import { required } from 'validators'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import ValidationMessages from 'components/ValidationMessages.vue'

const { t } = useI18n()
const emit = defineEmits(['submit', 'cancel'])
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const state = reactive({
  title: props.data.title || ''
})
const rules = {
  title: { required }
}
const v = useVuelidate(rules, state, {
  $autoDirty: true,
  $lazy: true
})

async function onSubmit () {
  const valid = await v.value.$validate()

  if (valid) {
    emit('submit', state)
  }
}
</script>
