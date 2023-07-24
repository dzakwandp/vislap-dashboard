// Composables
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/layouts/Dashboard.vue'
import LoginPage from '@/layouts/LoginPage.vue'

import Home from '@/views/Home.vue'
const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    redirect: '/home',
    children:[
      {
        path: 'home',
        name: 'home',
        component: Home
      }
    ]
  },
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
