import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTermStore } from 'src/stores/termStore';
import keycloak from 'src/services/keycloakService';

export function useRegisterTermDocumentPage() {
    const router = useRouter();
    const termStore = useTermStore();

    const accepted = ref(false);

    function onBack() {
        termStore.clear();
        router.back();
    }

    async function onNext() {
        if (!accepted.value) return;

        termStore.setSelectedRegisterTermDocument(true);

        if (!keycloak.authenticated) {
            void keycloak.login({ redirectUri: window.location.origin + '/termo-requisito' });
        } else {
            await router.push('/termo-requisito');
        }
    }

    return { accepted, onBack, onNext };
}