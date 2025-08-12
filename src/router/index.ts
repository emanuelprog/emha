import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useEventStore } from 'src/stores/eventStore';
import { useTermStore } from 'src/stores/termStore';
import keycloak from 'src/services/keycloakService';

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {

    const eventStore = useEventStore();
    const termStore = useTermStore();

    if (to.meta.requiresAuth && !keycloak.authenticated) {
      void keycloak.login({ redirectUri: window.location.origin + to.fullPath });
      return;
    }

    if (to.meta.validationType === 'event') {
      if (to.meta.requiresEvent && !eventStore.selectedEvent) {
        return next('/inicio');
      }

      if (to.meta.requiresEvent && to.meta.requiresEventTerm && !termStore.eventTerm) {
        return next('/termo-evento')
      }

      if (to.meta.requiresEvent && to.meta.requiresEventTerm && to.meta.requiresEventTermAccepted && !termStore.eventTermAccepted) {
        return next('/termo-evento-aceite');
      }

      if (to.meta.requiresEvent && to.meta.requiresEventTerm && to.meta.requiresEventTermAccepted && !termStore.eventTermAccepted && !eventStore.selectedEventComponent) {
        return next('/modulo-evento');
      }
    }

    if (to.meta.validationType === 'register') {
      if (to.meta.requiresRegisterTermDocument && !termStore.registerTermDocument) {
        return next('/termo-documento')
      }
      if (to.meta.requiresRegisterTermRequirement && !termStore.registerTermRequirement) {
        return next('/termo-requisito')
      }
      if (to.meta.requiresRegisterTermAccepted && !termStore.registerTermAccepted) {
        return next('/termo-aceite')
      }
    }

    next();
  });

  return Router;
});
