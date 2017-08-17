<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <!-- opens drawer below
      <button class="hide-on-drawer-visible" @click="$refs.drawer.open()">
        <i>menu</i>
      </button>
      -->
      <q-toolbar-title :padding="1">
        Motion Bank System Frontend v2
      </q-toolbar-title>
    </div>

    <div class="main">
      <router-link to="set">Hey, click here to go beyond the boring welcome screen</router-link>
    </div>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style>
  .main {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
</style>
