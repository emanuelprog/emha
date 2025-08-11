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

    if (to.meta.requiresEvent && !eventStore.selectedEvent) {
      return next('/inicio');
    }

    if (to.meta.requiresEvent && to.meta.requiresEventTerm && !termStore.eventTerm) {
      return next('/termo-evento')
    }

    next();
  });

  return Router;
});
