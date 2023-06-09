<template lang='pug'>
q-card(
  flat
  bordered
  )
  q-card-section
    h1.text-h5.text-center.q-mt-none.q-mb-lg {{ t('actions.createProfile') }}
    q-banner.bg-amber-1.q-mb-lg {{ t('descriptions.profile') }}
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
import { useMeta } from 'quasar'
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

useMeta({
  title: t('actions.createProfile')
})

const props = defineProps({
  redirect: {
    type: String
  }
})
const nameMaxLength = 32
const state = reactive({
  name: ''
})
const rules = {
  name: { required, maxLength: maxLength(nameMaxLength) }
}
const v = useVuelidate(rules, state, {
  $autoDirty: true,
  $lazy: true
})

async function onSubmit () {
  const valid = await v.value.$validate()

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
