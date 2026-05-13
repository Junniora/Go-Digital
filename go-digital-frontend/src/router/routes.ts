import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // ─── Auth Routes (no auth required) ───
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },

  // ─── Protected Routes ───
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'requests',
        name: 'requests',
        component: () => import('pages/RequestsListPage.vue'),
      },
      {
        path: 'requests/new',
        name: 'create-request',
        component: () => import('pages/CreateRequestPage.vue'),
      },
      {
        path: 'requests/:id',
        name: 'request-detail',
        component: () => import('pages/RequestDetailPage.vue'),
      },
    ],
  },

  // ─── 404 ───
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
