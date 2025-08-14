import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTermStore } from 'src/stores/termStore';

export function useRegisterTermAcceptedPage() {
    const router = useRouter();
    const termStore = useTermStore();

    const accepted = ref(false);

    function onBack() {
        termStore.setSelectedRegisterTermRequirement(false);
        router.back();
    }

    async function onNext() {
        if (!accepted.value) return;

        termStore.setSelectedRegisterTermAccepted(true);
        await router.push('/valida-formulario-cadastro');
    }

    return { accepted, onBack, onNext };
}