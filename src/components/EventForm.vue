<template lang='pug'>
q-form.q-gutter-sm(@submit='onSubmit()')
  q-input(
    v-model='state.name'
    :label='t("labels.name") + " *"'
    :hint='t("descriptions.maxLength", { n: nameMaxLength })'
    hide-hint
    bottom-slots
    :error='v.name.$error'
    )
    template(v-slot:error)
      ValidationMessages(:errors='v.name.$errors')
  q-input(
    type='textarea'
    autogrow
    v-model='state.notice'
    :label='t("labels.notice")'
    :hint='t("descriptions.maxLength", { n: noticeMaxLength })'
    hide-hint
    bottom-slots
    :error='v.notice.$error'
    )
    template(v-slot:error)
      ValidationMessages(:errors='v.notice.$errors')
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
import { reactive, watch } from 'vue'
import { required, maxLength, pattern } from 'validators'
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
const nameMaxLength = 128
const noticeMaxLength = 1000
const state = reactive({
  name: props.data.name || '',
  notice: props.data.notice || ''
})
const rules = {
  name: { required, maxLength: maxLength(nameMaxLength) },
  notice: { maxLength: maxLength(noticeMaxLength) }
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
