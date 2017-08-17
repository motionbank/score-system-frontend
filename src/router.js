import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  return () => System.import(`components/${component}.vue`)
}

export default new VueRouter({
  routes: [
    { path: '/', component: load('Welcome') },
    {
      path: '/set',
      component: load('Sets'),
      children: [
        { path: ':path', component: load('CellSet'), props: true }
      ]
    },
    { path: '*', component: load('Error404') }
  ]
})
