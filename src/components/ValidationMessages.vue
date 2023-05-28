<template lang='pug'>
component(
  v-for='e in errors'
  :is='tag'
  :class='className'
  ) {{ e.$message }}
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  },
  errors: {
    type: Array,
    required: true
  },
  tag: {
    type: String,
    default: 'div'
  }
})
</script>
