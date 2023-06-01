<template lang='pug'>
div(v-if='eventStore.isLoaded')
  h1.text-h5.flex.no-wrap
    q-icon.text-primary(
      name='event'
      size='lg'
      )
    .q-ml-sm {{ eventStore.metadata.data.name }}
  .q-my-md.q-gutter-sm(v-if='eventStore.notices.length')
    q-banner.bg-warning(
      v-for='notice in eventStore.notices'
      :key='notice.$id'
      dense
      rounded
      dark
      ) {{ notice.data.content }}
  .flex.justify-center
    q-btn(
      push
      :label='t("actions.createNotice")'
      @click='createNotice()'
      )
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventStore } from 'stores/event'
import { useUserStore } from 'stores/user'
import { useLoading } from 'composables/loading'
import { useQuasar } from 'quasar'
import NoticeCreationDialog from 'components/NoticeCreationDialog.vue'

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

onMounted(() => loading.start(() => eventStore.load({ id: props.id })))
onUnmounted(() => eventStore.unload())

function createNotice () {
  $q.dialog({
    component: NoticeCreationDialog
  })
}
</script>
