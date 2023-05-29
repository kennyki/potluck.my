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
    v-model='state.id'
    :label='t("labels.id") + " *"'
    :hint='`${ t("descriptions.maxLength", { n: idMaxLength }) }. ${ t("descriptions.eventIdPattern") }`'
    hide-hint
    bottom-slots
    :error='v.id.$error'
    )
    template(v-slot:error)
      ValidationMessages(:errors='v.id.$errors')
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
import { reactive, watch } from 'vue'
import { required, maxLength, pattern } from 'validators'
import { useI18n } from 'vue-i18n'
import slug from 'slug'
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
const idMaxLength = 32
const state = reactive({
  name: props.data.name || '',
  id: props.data.id || ''
})
const rules = {
  name: { required, maxLength: maxLength(nameMaxLength) },
  id: { required, maxLength: maxLength(idMaxLength), pattern: pattern(/^[a-zA-Z0-9-]*$/, t('descriptions.eventIdPattern')) }
}
const v = useVuelidate(rules, state, {
  $autoDirty: true,
  $lazy: true
})

watch(() => state.name, (val) => {
  state.id = slug(val.substring(0, idMaxLength))
})

async function onSubmit () {
  const valid = await this.v.$validate()

  if (valid) {
    emit('submit', state)
  }
}
</script>
