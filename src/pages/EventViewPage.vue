<template lang='pug'>
div(v-if='eventStore.isLoaded')
  q-card(
    flat
    bordered
    )
    q-card-section
      h1.text-h5.q-my-none.flex.no-wrap
        q-icon.text-primary(
          name='event'
          size='lg'
          )
        .q-ml-sm {{ eventStore.metadata.data.name }}
    template(v-if='eventStore.metadata.data.notice')
      q-separator
      q-card-section.text-warning {{ eventStore.metadata.data.notice }}
    template(v-if='isHost')
      q-separator
      q-card-actions(align='right')
        q-btn(
          flat
          icon='edit'
          @click='editEvent()'
          )
  //- .q-my-md.q-gutter-sm(v-if='eventStore.items.length')
  //-   q-banner.text-warning(
  //-     v-for='item in eventStore.items'
  //-     :key='item.$id'
  //-     dense
  //-     rounded
  //-     ) {{ item.data.content }}
  //- .flex.justify-center
  //-   q-btn(
  //-     push
  //-     :label='t("actions.createItem")'
  //-     @click='createItem()'
  //-     )
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventStore } from 'stores/event'
import { useUserStore } from 'stores/user'
import { useLoading } from 'composables/loading'
import { useQuasar } from 'quasar'
import EventEditDialog from 'components/EventEditDialog.vue'
// import ItemCreationDialog from 'components/ItemCreationDialog.vue'

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

const isHost = computed(() => eventStore.metadata?.data?.host === userStore.account.$id)

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

// function createItem () {
//   $q.dialog({
//     component: ItemCreationDialog
//   })
// }
</script>
