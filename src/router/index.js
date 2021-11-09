import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/find-gp'
  },
  {
    path: '/find-gp',
    name: 'FindGP',
    component: () => import('../views/FindGP.vue')
  },
  {
    path: '/find-gp-search-results',
    name: 'FindGPSearchResults',
    component: () => import('../views/FindGPSearchResults.vue')
  },
  {
    path: '/find-mental-health-provider-search-results',
    name: 'FindMentalHealthResults',
    component: () => import('../views/FindMentalHealthResults.vue')
  },
  {
    path: '/explorer',
    name: 'Explorer',
    component: () => import('../views/explorer/Explorer.vue')
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
