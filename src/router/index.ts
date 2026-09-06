import { createRouter, createWebHashHistory } from 'vue-router';
import MonthView from '@/views/MonthView.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/', name: 'home', component: MonthView }]
});
