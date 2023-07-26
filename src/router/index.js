// Composables
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/layouts/Dashboard.vue'
import LoginPage from '@/layouts/LoginPage.vue'

import Home from '@/views/Home.vue'
import Produk from '@/views/Produk/DaftarProduk.vue'
import Kategori from '@/views/Kategori/DaftarKategori.vue'
import DetailProduk from '@/views/Produk/DetailProduk.vue'
import TambahProduk from '@/views/Produk/TambahProduk.vue'
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
      },
      {
        path: 'category',
        name: 'category',
        component: Kategori
      },
      {
        path: 'products',
        name: 'products',
        component: Produk
      },
      {
        path: 'addproduct',
        name: 'addproduct',
        component: TambahProduk
      },
      {
        path: 'product/:id',
        name: 'product',
        component: DetailProduk
      }
    ]
  },
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
