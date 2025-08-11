import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTermStore = defineStore('term', () => {
    const eventTerm = ref<boolean | null>(null);
    const eventTermAccepted = ref<boolean | null>(null);

    function setSelectedEventTerm(accepted: boolean | null) {
        eventTerm.value = accepted;
    }

    function setSelectedEventTermAccepted(accepted: boolean | null) {
        eventTermAccepted.value = accepted;
    }

    function clear() {
        eventTerm.value = null;
        eventTermAccepted.value = null;
    }

    return {
        eventTerm,
        eventTermAccepted,
        setSelectedEventTerm,
        setSelectedEventTermAccepted,
        clear
    };
});