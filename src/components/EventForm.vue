<template lang='pug'>
q-form.q-gutter-sm(@submit='onSubmit()')
  q-input(
    v-model='state.name'
    :label='t("labels.name") + " *"'
    :hint='t("descriptions.nameMaxLength", { n: nameMaxLength })'
    hide-hint
    bottom-slots
    :error='v.name.$error'
    )
    template(v-slot:error)
      ValidationMessages(:errors='v.name.$errors')
  q-input(
    type='textarea'
    v-model='state.description'
    :label='t("labels.description")'
    autogrow
    )
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
import { required, maxLength } from 'validators'
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
const nameMaxLength = 32
const state = reactive({
  name: props.data.name || '',
  description: props.data.description || ''
})
const rules = {
  name: { required, maxLength: maxLength(nameMaxLength) }
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
