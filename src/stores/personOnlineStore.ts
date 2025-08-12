import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PersonOnlineType } from 'src/types/personOnlineType';

export const usePersonOnlineStore = defineStore('personOnline', () => {
    const selectedPersonOnline = ref<PersonOnlineType | null>(null);

    function setSelectedPersonOnline(personOnline: PersonOnlineType | null) {
        selectedPersonOnline.value = personOnline;
    }

    function clear() {
        selectedPersonOnline.value = null;
    }

    return {
        selectedPersonOnline,
        setSelectedPersonOnline,
        clear
    };
}, {
    persist: true
});