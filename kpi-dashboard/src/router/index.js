import { createRouter, createWebHistory } from 'vue-router';
import DashboardOverview from '../components/DashboardOverview.vue';

const routes = [
  {
    path: '/',
    name: 'DashboardOverview',
    component: DashboardOverview,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/KPDash_for_Small_Business/' : '/'), // <-- ИЗМЕНИТЕ ЭТУ СТРОКУ!
  routes,
});

export default router;