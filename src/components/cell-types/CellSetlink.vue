<template>
  <router-link :to="setLink">
    <div :style="'background-image: url(http://motionbank.meso.net/' + cell.poster_image.medium.url + ')'"></div>
  </router-link>
</template>

<script>
  export default {
    props: ['cell'],
    data () {
      return {}
    },
    computed: {
      setLink () {
        return {path: this.cell.additional_fields['set-id']}
      }
    }
  }
</script>

<style scoped>
  div {
    width: 100%;
    height: 100%;
    background-color: white;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
