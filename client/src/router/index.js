import { createRouter, createWebHistory } from 'vue-router'
import DashboardOverview from '@/views/DashboardOverview.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardOverview,
    },
  ],
})

export default router
