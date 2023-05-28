<template lang='pug'>
q-card(
  flat
  bordered
  )
  q-card-section
    h1.text-h5.text-center.q-mt-none.q-mb-lg {{ t('actions.createProfile') }}
    q-form.q-gutter-sm(@submit='onSubmit()')
      q-input(
        v-model='state.name'
        :label='t("labels.name") + " *"'
        :hint='t("descriptions.profileNameLength")'
        hide-hint
        bottom-slots
        :error='v.name.$error'
        )
        template(v-slot:error)
          ValidationMessages(:errors='v.name.$errors')
      .q-mt-lg
        q-btn(
          type='submit'
          color='primary'
          :label='t("actions.submit")'
          )
        q-btn.q-ml-sm(
          type='button'
          :label='t("actions.cancel")'
          :to='{ name: "home" }'
          )
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLoading } from 'composables/loading'
import { useUserStore } from 'stores/user'
import useVuelidate from '@vuelidate/core'
import { required, maxLength } from 'validators'
import { useI18n } from 'vue-i18n'
import ValidationMessages from 'components/ValidationMessages.vue'

const { t } = useI18n()
const router = useRouter()
const loading = useLoading()
const userStore = useUserStore()

const props = defineProps({
  redirect: {
    type: String
  }
})

const state = reactive({
  name: ''
})
const rules = {
  name: { required, maxLength: maxLength(32) }
}
const v = useVuelidate(rules, state, {
  $autoDirty: true,
  $lazy: true
})

async function onSubmit () {
  const valid = await this.v.$validate()

  if (!valid) {
    return
  }

  await loading.start(() => userStore.login(state))

  if (props.redirect) {
    window.location.replace(props.redirect)
  } else {
    router.replace({ name: 'home' })
  }
}
</script>
