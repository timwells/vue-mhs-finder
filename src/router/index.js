import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/find-by-location'
  },
  {
    path: '/find-by-location',
    name: 'FindByLocation',
    component: () => import('../views/FindByLocation.vue')
  },
  {
    path: '/finder-results',
    name: 'FinderResults',
    component: () => import('../views/FinderResults.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
