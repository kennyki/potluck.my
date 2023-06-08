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
      q-card(
        flat
        bordered
        square
      )
        q-tabs(
          v-model='tab'
          inline-label
          dense
          no-caps
        )
          q-tab(
            name='link'
            :label='t("labels.link")'
          )
          q-tab(
            name='whatsapp'
            :label='t("labels.whatsapp")'
          )
          q-tab(
            name='html'
            :label='t("labels.html")'
          )
        q-separator
        q-tab-panels(
          v-model='tab'
          animated
          )
          q-tab-panel(name='link')
            q-input(
              :model-value='link'
              readonly
            )
          q-tab-panel(name='whatsapp')
            .white-space-pre-wrap {{ whatsappText }}
          q-tab-panel(name='html')
            .white-space-pre-wrap {{ htmlText }}
        q-separator
        .flex.items-center.q-pa-sm
          q-btn(
            push
            no-caps
            color='primary'
            :label='t("actions.copy")'
            @click='copyText()'
          )
          small.q-ml-sm.text-grey-7(v-if='copied') {{ t('labels.copied') }}
</template>

<script setup>
import { computed, ref } from 'vue'
import { useClipboard, usePermission } from '@vueuse/core'
import { useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useEventStore, ItemStatus } from 'stores/event'

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
const { t } = useI18n()
const eventStore = useEventStore()
const clipboard = useClipboard({ legacy: true })
const permissionRead = usePermission('clipboard-read')
const permissionWrite = usePermission('clipboard-write')

const tab = ref('link')
const copied = ref(clipboard.copied)
const link = window.location.href

const items = computed(() => eventStore.items.filter(item => item.status === ItemStatus.active))

const whatsappText = computed(() => `*${eventStore.metadata.data.name}*

${eventStore.metadata.data.notice}

_${t('labels.itemTitle')}_

${items.value.map(item => `- ${item.data.title} <${item.creatorName}>`).join('\n')}
`)

const htmlText = computed(() => `<p><strong>${eventStore.metadata.data.name}</strong></p>
<p>${eventStore.metadata.data.notice}</p>
<hr>
<p><em>${t('labels.itemTitle')}</em></p>
<ul>
  ${items.value.map(item => `<li>${item.data.title} &lt;${item.creatorName}&gt;</li>`).join('\n')}
</ul>
`)

function copyText () {
  let source

  switch (tab.value) {
    case 'whatsapp':
      source = whatsappText.value
      break
    case 'html':
      source = htmlText.value
      break
    default:
      source = link
  }

  clipboard.copy(source)
}
</script>
