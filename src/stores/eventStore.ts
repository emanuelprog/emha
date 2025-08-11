import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { EventType } from 'src/types/eventType';
import type { CommercialModuleType } from 'src/types/commercialModuleType';

export const useEventStore = defineStore('event', () => {
    const selectedEvent = ref<EventType | null>(null);
    const selectedCommercialModule = ref<CommercialModuleType | null>(null);

    function setSelectedEvent(event: EventType | null) {
        selectedEvent.value = event;
    }

    function setSelectedCommercialModule(commercialModule: CommercialModuleType | null) {
        selectedCommercialModule.value = commercialModule;
    }

    function clear() {
        selectedEvent.value = null;
        selectedCommercialModule.value = null;
    }

    return {
        selectedEvent,
        selectedCommercialModule,
        setSelectedEvent,
        setSelectedCommercialModule,
        clear
    };
});