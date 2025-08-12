import { boot } from 'quasar/wrappers';
import keycloak from 'src/services/keycloakService';
import { api } from 'boot/axios';

export default boot(async ({ router }) => {
  try {
    await keycloak.init({
      onLoad: 'check-sso'
    });

    if (keycloak.authenticated) {
      api.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
    }
  } catch (error) {
    console.error('Erro ao inicializar Keycloak', error);
  }

  router.afterEach(() => {
    if (window.location.hash.includes('state=')) {
      window.history.replaceState(
        { ...window.history.state },
        '',
        window.location.pathname
      );
    }
  });
});