import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/inicio' },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'inicio', component: () => import('pages/Home/HomePage.vue'), meta: { public: true } },
      { path: 'area-do-mutuario', component: () => import('pages/BorrowerArea/BorrowerAreaPage.vue'), meta: { public: true } },
      { path: 'cadastrados', component: () => import('pages/Registered/RegisteredPage.vue'), meta: { public: true } },
      { path: 'beneficiados', component: () => import('pages/Benefited/BenefitedPage.vue'), meta: { public: true } },
      { path: 'segunda-via', component: () => import('pages/SecondCopy/SecondCopyPage.vue'), meta: { public: true } },

      { path: 'termo-evento', component: () => import('pages/EventTerm/EventTermPage.vue'), meta: { public: true, requiresEvent: true } },
      {
        path: 'termo-evento-aceite', component: () => import('pages/EventTermAccepted/EventTermAcceptedPage.vue'),
        meta: { public: true, requiresEvent: true, requiresEventTerm: true }
      },
    ],
  },
];

export default routes;
