import { useInscriptionStore } from "src/stores/inscriptionStore";
import { usePersonOnlineStore } from "src/stores/personOnlineStore";
import { ref } from "vue";

export function useCompletedFormPage() {

    const isRegister = window.location.pathname.includes("cadastro");

    const isProofLoading = ref(false);
    const isProtocolLoading = ref(false);

    const inscriptionStore = useInscriptionStore();
    const personOnlineStore = usePersonOnlineStore();

    async function onProof() {
        isProofLoading.value = true;

        await sleep(1500);

        const birtUrl = import.meta.env.VITE_BIRT_URL;

        let url;

        if (!isRegister) {
            url = `${birtUrl}emhinseverel.rptdesign&__format=pdf&codins=${inscriptionStore.selectedInscription?.id}`;
        } else {
            url = `${birtUrl}emhinscadrel.rptdesign&__format=pdf&senonl=${personOnlineStore.selectedPersonOnline?.registrationPassword}`;
        }

        isProofLoading.value = false;
        window.open(url, '_blank');
    }

    async function onProtocol() {
        isProtocolLoading.value = true;

        await sleep(1500);

        const birtUrl = import.meta.env.VITE_BIRT_URL;

        const url = `${birtUrl}emhonlrel.rptdesign&__format=pdf&protocolo=${personOnlineStore.selectedPersonOnline?.registrationPassword}`;

        window.open(url, '_blank');

        isProtocolLoading.value = false;
    }

    function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return {
        isRegister,
        isProofLoading,
        onProof,
        isProtocolLoading,
        onProtocol
    };
}
