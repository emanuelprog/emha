import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEventStore } from 'src/stores/eventStore';
import { useTermStore } from 'src/stores/termStore';
import { fetchEventComponents } from 'src/services/eventComponentService';
import type { EventComponentType } from 'src/types/eventComponentType';

export function useEventModulePage() {
    const router = useRouter();
    const eventStore = useEventStore();
    const termStore = useTermStore();
    const validate = ref(false);

    const selectedModule = ref<EventComponentType | null>(null);

    const moduleOptions = ref<EventComponentType[]>([]);

    const hasEvent = computed(() => !!eventStore.selectedEvent);

    async function loadOption() {
        if (!eventStore.selectedEvent?.id) return;

        const [eventComponentRes] = await Promise.all([
            fetchEventComponents(eventStore.selectedEvent?.id)
        ]);

        moduleOptions.value = Array.isArray(eventComponentRes)
            ? [...eventComponentRes].sort((a, b) => a.description.localeCompare(b.description))
            : [];
    }

    function onBack() {
        eventStore.setSelectedEventComponent(null);
        termStore.setSelectedEventTermAccepted(false);
        router.back();
    }

    async function onNext() {
        validate.value = true;

        if (!hasEvent.value || !selectedModule.value) return;

        eventStore.setSelectedEventComponent(selectedModule.value);

        await router.push('/valida-formulario-evento');
    }

    return { validate, hasEvent, selectedModule, moduleOptions, loadOption, onBack, onNext };
}