// Composables
import { useAuthStore } from '@/store/authStore'

import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/layouts/Dashboard.vue'
import LoginPage from '@/layouts/LoginPage.vue'

import Home from '@/views/Admin/Home.vue'
import Produk from '@/views/Admin/Produk/DaftarProduk.vue'
import Kategori from '@/views/Admin/Kategori/DaftarKategori.vue'
import DaftarTransaksi from '@/views/Admin/Transaksi/DaftarTransaksi.vue'
import DetailTransaksi from '@/views/Admin/Transaksi/DetailTransaksi.vue'
import DetailProduk from '@/views/Admin/Produk/DetailProduk.vue'
import TambahProduk from '@/views/Admin/Produk/TambahProduk.vue'
import ServiceAdmin from '@/views/Admin/Service/ServiceAdmin.vue'

import AdminList from '@/views/AdminList.vue'

import ServiceList from '@/views/Technician/ServiceList.vue'
import ServiceDetail from '@/views/Technician/ServiceDetail.vue'
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
      // admin
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
        path: 'txs',
        name: 'transaction',
        component: DaftarTransaksi
      },
      {
        path: 'txs/:id',
        name: 'tx',
        component: DetailTransaksi
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
      },
      {
        path: 'service_admin',
        name: 'service_admin',
        component: ServiceAdmin
      },
      {
        path: 'service_detail/:id',
        name: 'service_detail',
        component: ServiceDetail
      },
      // superadmin+admin
      {
        path: 'admin_list',
        name: 'admin_list',
        component: AdminList
      },
      // technician
      {
        path: 'service_tech',
        name: 'service_tech',
        component: ServiceList
      }
    ]
  },
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
router.beforeEach((to, from, next)=>{
  const authStore=useAuthStore()
  const isAuth=authStore.isLoggedIn
  if (to.name !== 'login' && !isAuth) next ({name:"login"})
  if (to.name == 'login' && isAuth) next({name:"home"})
  else next()
})
export default router
