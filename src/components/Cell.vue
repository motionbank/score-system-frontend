<template>
  <div class="cell-item"
       v-bind:style="'grid-column-start:' + (cell.x+1) + ';' +
                     'grid-column-end: span ' + cell.width + ';' +
                     'grid-row-start:' + (cell.y+1) + ';' +
                     'grid-row-end: span ' + cell.height"
       v-bind:title="cell.title">
    <component :is="cellTypeToClassName(cell.type)" :cell="cell" :class="'cell-type-' + cell.type.toLowerCase()">
    </component>
  </div>
</template>

<script>
  import cellTypes from './cell-types'

  export default {
    props: ['cell'],
    data () {
      return {}
    },
    mounted () {
      if (cellTypes.hasOwnProperty(this.cellTypeToClassName(this.cell.type)) === false) {
        throw new Error('This cell type is missing: ' + this.cell.type)
      }
    },
    methods: {
      cellTypeToClassName (type) {
        return 'Cell' + type.slice(0, 1).toUpperCase() + type.slice(1).replace(/[^a-z0-9]/ig, '').toLowerCase()
      }
    },
    components: cellTypes
  }
</script>

<style lang="stylus">

.cell-item

  &
    overflow: hidden
    grid-column-start: 1
    grid-column-end: span 1
    grid-row-start: 1
    grid-row-end: span 1

  h1, h2, h3, h4, h5, h6
    font-size: 1em
    font-weight: normal

  a, a:hover, a:visited
    color: black
    text-decoration: underline

</style>
