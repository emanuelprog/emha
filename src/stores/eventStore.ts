import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { EventType } from 'src/types/eventType';
import type { EventComponentType } from 'src/types/eventComponentType';

export const useEventStore = defineStore('event', () => {
    const selectedEvent = ref<EventType | null>(null);
    const selectedEventComponent = ref<EventComponentType | null>(null);

    function setSelectedEvent(event: EventType | null) {
        selectedEvent.value = event;
    }

    function setSelectedEventComponent(EventComponent: EventComponentType | null) {
        selectedEventComponent.value = EventComponent;
    }

    function clear() {
        selectedEvent.value = null;
        selectedEventComponent.value = null;
    }

    return {
        selectedEvent,
        selectedEventComponent,
        setSelectedEvent,
        setSelectedEventComponent,
        clear
    };
}, {
    persist: true
});