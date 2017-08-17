<template>
  <div :style="'background-image: url(http://motionbank.meso.net/' + cell.poster_image.medium.url + ')'"></div>
</template>

<script>
export default {
  props: ['cell'],
  data () {
    return {}
  },
  mounted () {
  }
}
</script>

<style scoped>
  div {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
