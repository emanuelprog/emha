import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEventStore } from 'src/stores/eventStore';
import DOMPurify from 'dompurify';
import { useTermStore } from 'src/stores/termStore';
import keycloak from 'src/services/keycloakService';

export function useEventTermPage() {
    const router = useRouter();
    const eventStore = useEventStore();
    const termStore = useTermStore();

    const hasEvent = computed(() => !!eventStore.selectedEvent);
    const accepted = ref(false);

    const safeHtml = computed(() => {
        const html = eventStore.selectedEvent?.descriptionText ?? '';
        return DOMPurify.sanitize(html);
    });

    function onBack() {
        eventStore.clear();
        termStore.clear();
        router.back();
    }

    async function onNext() {
        if (!hasEvent.value || !accepted.value) return;

        termStore.setSelectedEventTerm(true);

        if (!keycloak.authenticated) {
            void keycloak.login({ redirectUri: window.location.origin + '/termo-evento-aceite' });
        } else {
            await router.push('/termo-evento-aceite');
        }
    }

    return { hasEvent, safeHtml, accepted, onBack, onNext };
}