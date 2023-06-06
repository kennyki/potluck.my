<template lang='pug'>
div(v-if='eventStore.isLoaded')
  q-card.bg-amber-1(
    flat
    bordered
    )
    q-card-section
      h1.text-h5.q-mt-none.q-mb-sm.flex.no-wrap
        q-icon.text-primary(
          name='event'
          size='md'
          )
        .q-ml-sm {{ eventStore.metadata.data.name }}
      .flex.items-end.justify-between
        .flex.items-center.text-caption.text-grey
          q-icon(name='person')
          .q-ml-xs {{ eventStore.metadata.creatorName }}
        div(v-if='isHost')
          q-btn(
            round
            flat
            icon='edit'
            size='sm'
            @click='editEvent()'
            )
    template(v-if='eventStore.metadata.data.notice')
      q-separator
      q-card-section.text-grey-7 {{ eventStore.metadata.data.notice }}
  h6.q-mb-sm {{ t('labels.itemTitle') }}
  q-list(
    v-if='items.length'
    bordered
    separator
  )
    q-item(
      v-for='item in items'
      :key='item.$id'
      :clickable='false'
      :class='{ "bg-grey-1 text-grey-6": item.status !== "active" }'
      )
      q-item-section
        q-item-label {{ item.data.title }}
        q-item-label
          .flex.items-center.text-caption.text-grey
            q-icon(name='person')
            .q-ml-xs {{ item.creatorName }}
      q-item-section(
        side
        top
      )
        template(v-if='item.creatorId === userStore.id')
          template(v-if='item.status === "active"')
            q-btn(
              round
              flat
              icon='edit'
              size='sm'
              @click='editItem(item)'
              )
            q-btn(
              round
              flat
              icon='delete'
              size='sm'
              @click='deleteItem(item)'
              )
          q-btn.disabled(
            v-else
            round
            flat
            icon='block'
            size='sm'
          )
            q-tooltip {{ t('descriptions.rejected') }}
        q-btn(
          v-else-if='isHost'
          round
          flat
          icon='block'
          size='sm'
          @click='rejectItem(item)'
          )
  .q-mt-md
    q-btn(
      push
      no-caps
      color='primary'
      :label='t("actions.add")'
      @click='createItem()'
      )
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventStore } from 'stores/event'
import { useUserStore } from 'stores/user'
import { useLoading } from 'composables/loading'
import { useQuasar } from 'quasar'
import EventEditDialog from 'components/EventEditDialog.vue'
import ItemFormDialog from 'components/ItemFormDialog.vue'

const $q = useQuasar()
const { t } = useI18n()
const eventStore = useEventStore()
const userStore = useUserStore()
const loading = useLoading()

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const status = ref('active')

const isHost = computed(() => eventStore.metadata?.creatorId === userStore.id)
const items = computed(() => eventStore.items.filter(item => item.status === status.value || item.creatorId === userStore.id))

onMounted(() => loading.start(() => eventStore.load({ id: props.id })))
onUnmounted(() => eventStore.unload())

function editEvent () {
  $q.dialog({
    component: EventEditDialog,
    componentProps: {
      data: eventStore.metadata.data
    }
  })
}

function createItem () {
  $q.dialog({
    component: ItemFormDialog
  }).onOk(params => {
    loading.start(() => eventStore.createItem(params))
  })
}

function editItem (item) {
  $q.dialog({
    component: ItemFormDialog,
    componentProps: { data: item.data }
  }).onOk(params => {
    loading.start(() => eventStore.updateItem(item, params))
  })
}

function deleteItem (item) {
  $q.dialog({
    class: 'text-negative',
    color: 'negative',
    title: t('actions.delete'),
    message: t('prompts.deleteItem', { item: item.data.title }),
    ok: {
      label: t('labels.yes'),
      flat: false
    },
    cancel: t('labels.no')
  }).onOk(async () => {
    loading.start(() => eventStore.deleteItem(item))
  })
}

function rejectItem (item) {
  $q.dialog({
    class: 'text-negative',
    color: 'negative',
    title: t('actions.reject'),
    message: t('prompts.rejectItem', { item: item.data.title, name: item.creatorName }),
    ok: {
      label: t('labels.yes'),
      flat: false
    },
    cancel: t('labels.no')
  }).onOk(async () => {
    loading.start(() => eventStore.rejectItem(item))
  })
}
</script>
