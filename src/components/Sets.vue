<template>
  <q-layout>

    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        <template v-if="currentSet">Set »{{currentSet.title | denumber}}«</template><template v-else>All Sets</template>
      </q-toolbar-title>
    </div>

    <template v-if="!($route.params.path) || !(overviewSet)">
      <div class="row wrap justify-start">
        <template v-for="({path, title, description}, index) in sets">
          <router-link :to="{path:'/set/'+path}" class="width-1of5"><h4>{{title | denumber}}</h4><p>{{description}}</p></router-link>
        </template>
      </div>
    </template>
    <template v-else>
      <router-view :set-path="$route.params.path" :set-id="getSetIdForPath($route.params.path)" class="layout-view"></router-view>
    </template>

  </q-layout>
</template>

<script>
  import api from '../api'

  export default {
    data () {
      return {
        sets: [],
        overviewSet: undefined,
        currentSet: undefined
      }
    },
    mounted () {
      api.getSets(this.setSets)
    },
    beforeRouteUpdate (to, from, next) {
      console.log('Switching to set', to.params.path)
      if (to.params.path) {
        this.setCurrentSetByPath(to.params.path)
      }
      else {
        this.currentSet = undefined
      }
      next()
    },
    beforeRouteLeave (to, from, next) {
      this.currentSet = undefined
    },
    methods: {
      setSets (sets) {
        this.sets = sets
        this.overviewSet = this.sets.find((s) => s.path === 'sets')
        if (this.$route.params.path) {
          this.setCurrentSetByPath(this.$route.params.path)
        }
      },
      setCurrentSetByPath (setPath) {
        let byId = this.sets.find((s) => s.id === setPath)
        this.currentSet = byId || this.sets.find((s) => s.path === setPath)
      },
      getSetIdForPath (setPath) {
        let byId = this.sets.find((s) => s.id === setPath)
        return (byId || this.sets.find((s) => s.path === setPath)).id
      }
    }
  }
</script>

<style>
  .router-link-active {
    background-color: #eee
  }
  .row.layout-view a:hover {
    background-color: #eee
  }
</style>
