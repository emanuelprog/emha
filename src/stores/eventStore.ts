import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { EventType } from 'src/types/eventType';

export const useEventStore = defineStore('event', () => {
    const selectedEvent = ref<EventType | null>(null);

    function setSelectedEvent(event: EventType | null) {
        selectedEvent.value = event;
    }

    function clear() {
        selectedEvent.value = null;
    }

    return {
        selectedEvent,
        setSelectedEvent,
        clear
    };
}, {
    persist: true
});