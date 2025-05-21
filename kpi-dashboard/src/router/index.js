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
  history: createWebHistory(),
  routes,
});

export default router;