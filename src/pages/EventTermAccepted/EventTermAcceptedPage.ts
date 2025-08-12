import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEventStore } from 'src/stores/eventStore';
import DOMPurify from 'dompurify';
import { useTermStore } from 'src/stores/termStore';

export function useEventTermAcceptedPage() {
    const router = useRouter();
    const eventStore = useEventStore();
    const termStore = useTermStore();

    const hasEvent = computed(() => !!eventStore.selectedEvent);
    const accepted = ref(false);

    const safeHtml = computed(() => {
        const html = eventStore.selectedEvent?.schedule ?? '';
        return DOMPurify.sanitize(html);
    });

    function onBack() {
        termStore.setSelectedEventTermAccepted(false);
        termStore.setSelectedEventTerm(false);
        router.back();
    }

    async function onNext() {
        if (!hasEvent.value || !accepted.value) return;

        termStore.setSelectedEventTermAccepted(true);
        await router.push('/modulo-evento');
    }

    return { hasEvent, safeHtml, accepted, onBack, onNext };
}
