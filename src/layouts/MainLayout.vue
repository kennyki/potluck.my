<template lang='pug'>
q-layout(view='hHh lpR fFf')
  q-header.bg-white.text-black
    q-toolbar.flex.justify-center
      q-btn(
        flat
        :to='{ name: "home" }'
        ) Potluck.my
  q-page-container
    router-view
</template>
