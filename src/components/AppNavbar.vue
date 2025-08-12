<template>
  <q-header class="bg-primary text-white">
    <q-toolbar class="relative-position">
      <div class="absolute-center">
        <q-toolbar-title class="text-weight-bold text-center">EMHA</q-toolbar-title>
      </div>

      <div class="q-ml-auto">
        <q-btn round flat>
          <div class="row items-center no-wrap">
            <q-icon name="account_circle" />
            <q-icon name="arrow_drop_down" size="16px" />
          </div>
          <q-menu>
            <q-list style="min-width: 200px; max-width: 300px">
              <q-item v-if="keycloak.authenticated" exact class="q-dark-fix">
                <q-item-section>
                  <div class="text-weight-medium">{{ userName }}</div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item v-if="keycloak.authenticated" clickable v-close-popup @click="logout" exact class="q-dark-fix">
                <q-item-section avatar><q-icon name="logout" /></q-item-section>
                <q-item-section>Sair</q-item-section>
              </q-item>

              <q-item v-else clickable v-close-popup @click="login" exact class="q-dark-fix">
                <q-item-section avatar><q-icon name="login" /></q-item-section>
                <q-item-section>Fazer login</q-item-section>
              </q-item>

              <q-separator />
              <q-item clickable @click="showConfigModal = true" exact class="q-dark-fix">
                <q-item-section avatar><q-icon name="settings" /></q-item-section>
                <q-item-section>Configurações</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>

    <div class="bg-secondary text-black text-caption q-py-sm">
      <div class="row justify-center items-center q-gutter-md">
        <q-btn v-for="item in navItems" :key="item.label" flat no-caps class="nav-button" rounded
          @click="router.push(item.route)">
          <template v-if="item.icon">
            <q-icon :name="item.icon" size="18px" class="q-mr-xs" />
          </template>
          {{ item.label }}
        </q-btn>
      </div>
    </div>

    <div v-if="hostName" class="text-weight-bold text-center bg-negative q-py-sm">
      AMBIENTE DE HOMOLOGAÇÃO
    </div>
  </q-header>

  <ConfigModal v-model="showConfigModal" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import ConfigModal from 'src/components/ConfigModal.vue'
import keycloak from 'src/services/keycloakService'
import { useTermStore } from 'src/stores/termStore'
import { useEventStore } from 'src/stores/eventStore'

const $q = useQuasar()
const router = useRouter()
const showConfigModal = ref(false)

const userName = computed(() => keycloak.tokenParsed?.name + ' ' + keycloak.tokenParsed?.lastName || 'Usuário');

const termStore = useTermStore();
const eventStore = useEventStore();

const navItems = [
  { label: '', route: 'inicio', icon: 'home' },
  { label: 'Cadastro', route: 'cadastro' },
  { label: 'Área do Mutuário', route: 'area-do-mutuario' },
  { label: 'Cadastrados', route: 'cadastrados' },
  { label: 'Beneficiados', route: 'beneficiados' },
  { label: '2ª via de Protocolo', route: 'segunda-via' }
]

const hostName = window.location.hostname.includes("-h") || window.location.hostname.includes("localhost");

function login() {
  void keycloak.login({ redirectUri: window.location.origin + '/inicio' })
}

function logout() {
  let seconds = 2
  const notif = $q.notify({
    group: false,
    timeout: 0,
    message: `Sua sessão será encerrada em ${seconds}...`,
    type: 'info',
    position: 'top-right',
    classes: 'my-notify'
  })

  const interval = setInterval(() => {
    seconds--
    if (seconds > 0) {
      notif({ message: `Sua sessão será encerrada em ${seconds}...` })
    } else {
      clearInterval(interval)
      notif()
      sessionStorage.clear()
      termStore.clear()
      eventStore.clear()
      void keycloak.logout({ redirectUri: window.location.origin + '/inicio' })
    }
  }, 1000)
}
</script>

<style scoped>
.nav-button {
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
  color: black;
  transition: color 0.2s ease-in-out;
  padding: 0 6px;
  min-height: unset;
  height: 32px;
}

.nav-button .q-icon {
  color: black !important;
}
</style>
