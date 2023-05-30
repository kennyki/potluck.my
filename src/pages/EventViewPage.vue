<template lang='pug'>
div(v-if='eventStore.isLoaded')
  h1.text-h5.flex.no-wrap
    q-icon.text-primary(
      name='event'
      size='lg'
      )
    .q-ml-sm {{ metadata.name }}
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventStore } from 'stores/event'
import { useLoading } from 'composables/loading'

const { t } = useI18n()
const eventStore = useEventStore()
const loading = useLoading()

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const event = computed(() => eventStore.isLoaded ? eventStore.data : null)
const metadata = computed(() => event.value?.metadata.data)
const notices = computed(() => event.value?.notices.map(notice => notice.data))
const items = computed(() => event.value?.items.map(item => item.data))

onMounted(() => loading.start(() => eventStore.load({ id: props.id })))
onUnmounted(() => eventStore.unload())
</script>
