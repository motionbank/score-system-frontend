<template>
  <iframe v-bind:src="iframeSrc" @load="iframeLoaded" :style="'background-image: url(http://motionbank.meso.net/' + cell.poster_image.medium.url + ')'"></iframe>
</template>

<script>
  export default {
    props: ['cell'],
    data () {
      return {}
    },
    computed: {
      iframeSrc () {
        return this.cell.additional_fields['iframe-src']
      }
    },
    methods: {
      iframeLoaded (evt) {
        let iFrameEl = evt.path.shift()
      }
    }
  }
</script>

<style lang="stylus" scoped>

  iframe
    border: 0
    padding: 0
    margin: 0
    width: 100%
    height: 100%
    background-color: white
    background-size: contain
    background-repeat: no-repeat
    background-position: center

</style>
