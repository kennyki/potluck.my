<template>
  <router-view />
</template>

<script setup>
const initLoading = document.querySelector('#init-loading')

if (initLoading) {
  initLoading.remove()
}
</script>
