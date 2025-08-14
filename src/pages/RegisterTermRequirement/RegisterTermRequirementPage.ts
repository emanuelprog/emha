import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTermStore } from 'src/stores/termStore';

export function useRegisterTermRequirementPage() {
    const router = useRouter();
    const termStore = useTermStore();

    const accepted = ref(false);

    function onBack() {
        termStore.setSelectedRegisterTermDocument(false);
        router.back();
    }

    async function onNext() {
        if (!accepted.value) return;

        termStore.setSelectedRegisterTermRequirement(true);
        await router.push('/termo-aceite');
    }

    return { accepted, onBack, onNext };
}