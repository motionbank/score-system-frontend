<template>
  <div v-html="htmlContent">HTML</div>
</template>

<script>
export default {
  props: ['cell'],
  data () {
    return {}
  },
  computed: {
    htmlContent () {
      return this.cell.additional_fields['html-content']
    }
  }
}
</script>

<style scoped>
  div {
    padding: 1em;
  }
</style>
