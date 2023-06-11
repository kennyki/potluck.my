<template lang='pug'>
q-layout(view='hHh lpR fFf')
  q-header.bg-white.text-black.q-py-sm(
    reveal
    bordered
    )
    q-toolbar.flex.justify-center
      q-toolbar-title(shrink)
        q-btn(
          flat
          :to='{ name: "home" }'
          )
          img.logo(src='~assets/logo.png')
  q-page-container
    .row
      .col
      .col-12.col-sm-6
        q-page(padding)
          .flex.justify-end.q-mb-sm
            UserDropdown
          router-view
      .col
  q-footer.bg-white.text-grey-7(
    reveal
    bordered
  )
    q-toolbar.flex.justify-center
      q-btn(
        flat
        no-caps
        :label='t("labels.about")'
      )
      q-btn(
        flat
        no-caps
        :label='t("labels.privacy")'
        :to='{ name: "privacy" }'
      )
      q-btn(
        flat
        no-caps
        :label='t("labels.credits")'
        :to='{ name: "credits" }'
      )
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import UserDropdown from 'components/UserDropdown.vue'

const { t } = useI18n()
</script>
