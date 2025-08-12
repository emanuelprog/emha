import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTermStore = defineStore('term', () => {
    const eventTerm = ref<boolean | null>(null);
    const eventTermAccepted = ref<boolean | null>(null);

    const registerTermDocument = ref<boolean | null>(null);
    const registerTermRequirement = ref<boolean | null>(null);
    const registerTermAccepted = ref<boolean | null>(null);

    function setSelectedEventTerm(accepted: boolean | null) {
        eventTerm.value = accepted;
    }

    function setSelectedEventTermAccepted(accepted: boolean | null) {
        eventTermAccepted.value = accepted;
    }

    function setSelectedRegisterTermDocument(accepted: boolean | null) {
        registerTermDocument.value = accepted;
    }

    function setSelectedRegisterTermRequirement(accepted: boolean | null) {
        registerTermRequirement.value = accepted;
    }

    function setSelectedRegisterTermAccepted(accepted: boolean | null) {
        registerTermAccepted.value = accepted;
    }

    function clear() {
        eventTerm.value = null;
        eventTermAccepted.value = null;
        registerTermDocument.value = null;
        registerTermRequirement.value = null;
        registerTermAccepted.value = null;
    }

    return {
        eventTerm,
        eventTermAccepted,
        registerTermDocument,
        registerTermRequirement,
        registerTermAccepted,
        setSelectedEventTerm,
        setSelectedEventTermAccepted,
        setSelectedRegisterTermDocument,
        setSelectedRegisterTermRequirement,
        setSelectedRegisterTermAccepted,
        clear
    };
}, {
    persist: true
});