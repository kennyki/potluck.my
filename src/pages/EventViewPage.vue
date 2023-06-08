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
        div
          q-btn(
            round
            flat
            icon='share'
            size='sm'
            @click='shareEvent()'
            )
          template(v-if='isHost')
            q-btn(
              round
              flat
              icon='edit'
              size='sm'
              @click='editEvent()'
              )
    template(v-if='eventStore.metadata.data.notice')
      q-separator
      q-card-section {{ eventStore.metadata.data.notice }}
  .flex.justify-between.q-mt-xl.q-mb-sm
    h6.q-my-none {{ t('labels.itemTitle') }}
    q-btn(
      v-if='isHost'
      flat
      no-caps
      color='grey-7'
      )
      .q-pl-xs {{ statusOptions[status] }}
      q-icon(
        name='arrow_drop_down'
        size='xs'
        )
      q-menu(auto-close)
        q-list
          q-item(
            v-for='(label, toStatus) in statusOptions'
            :key='toStatus'
            clickable
            @click='status = toStatus'
            )
            q-item-section {{ label }}
  q-list(
    v-if='items.length'
    bordered
    separator
  )
    q-item(
      v-for='item in items'
      :key='item.$id'
      :clickable='false'
      :class='{ "bg-grey-1 text-grey-6": item.status !== ItemStatus.active }'
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
        template(v-if='item.creatorId === userStore.id && item.status === ItemStatus.active')
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
        template(v-else-if='isHost')
          q-btn(
            v-if='item.status === ItemStatus.active'
            round
            flat
            icon='block'
            size='sm'
            @click='rejectItem(item)'
            )
          q-btn(
            v-else
            round
            flat
            icon='check_circle'
            size='sm'
            @click='acceptItem(item)'
          )
  .q-mt-md(v-if='status === ItemStatus.active')
    q-btn(
      push
      no-caps
      color='primary'
      :label='t("actions.add")'
      @click='createItem()'
      )
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventStore, ItemStatus } from 'stores/event'
import { useUserStore } from 'stores/user'
import { useLoading } from 'composables/loading'
import { useQuasar } from 'quasar'
import EventEditDialog from 'components/EventEditDialog.vue'
import EventSharingDialog from 'components/EventSharingDialog.vue'
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

const status = ref(ItemStatus.active)
const statusOptions = Object.keys(ItemStatus).reduce((map, key) => {
  map[key] = t(`statuses.${key}`)
  return map
}, {})

const isHost = computed(() => eventStore.metadata?.creatorId === userStore.id)
const items = computed(() => eventStore.items.filter(item => item.status === status.value))

onMounted(() => loading.start(() => eventStore.load({ id: props.id })))
onUnmounted(() => eventStore.unload())

watch(status, (val) => {
  // only load the intended items
  loading.start(() => eventStore.loadItems({ id: props.id, status: status.value }))
})

function shareEvent () {
  $q.dialog({
    component: EventSharingDialog
  })
}

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

function acceptItem (item) {
  $q.dialog({
    title: t('actions.accept'),
    message: t('prompts.acceptItem', { item: item.data.title, name: item.creatorName }),
    ok: {
      label: t('labels.yes'),
      flat: false
    },
    cancel: t('labels.no')
  }).onOk(async () => {
    loading.start(() => eventStore.acceptItem(item))
  })
}
</script>
