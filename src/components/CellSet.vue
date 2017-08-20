<template>
  <div>
    <template v-if="set">
      <div class="cell-grid" v-bind:style="gridStyle">
        <template v-if="set.cells">
          <template v-for="(cell, index) in set.cells">
            <cell :cell="set.cells[index]"></cell>
          </template>
        </template>
      </div>
    </template>
    <template v-else>
      <p>Waiting for cell set to load …</p>
    </template>
  </div>
</template>

<script>
  import Cell from './Cell'
  import api from '../api'
  import _ from 'lodash'

  export default {
    props: [
      'setId'
    ],
    data () {
      return {
        renderFull: true,
        set: undefined,
        gridDimensions: {gridWidth: 0, gridHeight: 0, cellWidth: 0, cellHeight: 0},
        gridStyle: {width: '100%', height: '100%'}
      }
    },
    mounted: function () {
      this.updateGridDimensions = _.debounce(this._updateGridDimensions, 100)
      window.addEventListener('resize', this.updateGridDimensions)
      api.getCellSet(this.setId, this.setCellSet)
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.updateGridDimensions)
    },
    watch: {
      setId () {
        api.getCellSet(this.setId, this.setCellSet)
      },
      set () {
        this.updateGridDimensions()
      }
    },
    methods: {
      updateGridDimensions () {
        // see "mounted" above: is attached there / then
      },
      _updateGridDimensions () {
        let elWidth = this.$el.offsetWidth
        let elHeight = this.$el.offsetHeight
        let cellSizeRatio = this.set.cell_width / this.set.cell_height
        let gridHeight = elHeight
        let cellHeight = gridHeight / this.set.grid_rows
        let cellWidth = elWidth / Math.round(elWidth / (cellHeight * cellSizeRatio))
        let gridWidth = cellWidth * this.set.grid_cols
        let cellsPerWidth = elWidth / cellWidth
        let cellWidthMini = elWidth / this.set.grid_cols
        let gridHeightMini = cellWidthMini / cellSizeRatio
        this.gridDimensions = {
          original: {
            width: this.set.cell_width * this.set.grid_cols,
            height: this.set.cell_height * this.set.grid_rows,
            cell: {
              width: this.set.cell_width,
              height: this.set.cell_height,
              cellSizeRatio
            }
          },
          full: {
            width: gridWidth,
            height: gridHeight,
            cell: {
              width: cellWidth,
              height: cellHeight
            },
            cells_per_width: cellsPerWidth
          },
          mini: {
            width: elWidth,
            height: gridHeightMini * this.set.grid_rows,
            cell: {
              width: cellWidthMini,
              height: gridHeightMini
            }
          }
        }
        if (elWidth > 800) {
          this.gridStyle = {
            width: this.gridDimensions.full.width + 'px',
            height: '100%',
            'grid-auto-columns': this.gridDimensions.full.cell.width + 'px',
            'grid-auto-rows': this.gridDimensions.full.cell.height + 'px'
          }
        }
        else {
          this.gridStyle = {
            width: '100%',
            height: this.gridDimensions.mini.height + 'px',
            'grid-auto-columns': this.gridDimensions.mini.cell.width + 'px',
            'grid-auto-rows': this.gridDimensions.mini.cell.height + 'px'
          }
        }
      },
      setCellSet: function (cellSet) {
        this.set = cellSet
      }
    },
    components: {
      cell: Cell
    }
  }
</script>

<style scoped>
.cell-grid {
  display: grid;
  background-color: #eee;
}
</style>
