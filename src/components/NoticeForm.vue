<template lang='pug'>
q-form.q-gutter-sm(@submit='onSubmit()')
  q-input(
    v-model='state.content'
    :label='t("labels.content") + " *"'
    bottom-slots
    :error='v.content.$error'
    )
    template(v-slot:error)
      ValidationMessages(:errors='v.content.$errors')
  .q-mt-lg
    q-btn(
      type='submit'
      color='primary'
      :label='t("actions.submit")'
      )
    q-btn.q-ml-sm(
      type='button'
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
  content: props.data.content || ''
})
const rules = {
  content: { required }
}
const v = useVuelidate(rules, state, {
  $autoDirty: true,
  $lazy: true
})

async function onSubmit () {
  const valid = await this.v.$validate()

  if (valid) {
    emit('submit', state)
  }
}
</script>
