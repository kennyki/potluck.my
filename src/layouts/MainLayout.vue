<template lang='pug'>
q-layout(view='hHh lpR fFf')
  q-header.bg-white.text-black.q-py-sm
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
        router-view
      .col
</template>
