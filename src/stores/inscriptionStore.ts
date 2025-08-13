import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { InscriptionType } from 'src/types/inscriptionType';

export const useInscriptionStore = defineStore('inscription', () => {
    const selectedInscription = ref<InscriptionType | null>(null);

    function setSelectedInscription(Inscription: InscriptionType | null) {
        selectedInscription.value = Inscription;
    }

    function clear() {
        selectedInscription.value = null;
    }

    return {
        selectedInscription,
        setSelectedInscription,
        clear
    };
}, {
    persist: true
});