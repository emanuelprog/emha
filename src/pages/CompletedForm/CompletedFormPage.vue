<template>
    <q-page class="q-pa-md flex flex-center" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'"
        style="flex-direction: row-reverse;">
        <div ref="completedRef" style="width: 500px; height: 500px; margin-bottom: 20px;" />
        <div class="column items-center text-center" style="max-width: 500px; width: 100%;">

            <div class="text-positive text-h4 text-weight-bold q-mb-xs">
                {{ isRegister ? 'Cadastro concluído com sucesso!' : 'Inscrição concluída com sucesso!' }}
            </div>
            <div class="text-subtitle1 text-grey-7 q-mb-lg">
                Obrigado por concluir {{ isRegister ? 'seu cadastro' : 'sua inscrição' }}.
                Você pode imprimir seu comprovante ou protocolo abaixo.
            </div>

            <div class="column q-gutter-md" style="width: 100%;">
                <q-btn unelevated rounded color="primary" text-color="white" label="Imprimir Comprovante"
                    :loading="isProofLoading" @click="onProof" icon="description" size="lg"
                    class="q-px-lg shadow-2 hover-scale" />
                <q-btn v-if="isRegister" unelevated rounded color="secondary" text-color="white"
                    :loading="isProtocolLoading" @click="onProtocol" label="Imprimir Protocolo" icon="description"
                    size="lg" class="q-px-lg shadow-2 hover-scale" />
            </div>

        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCompletedFormPage } from './CompletedFormPage';
import './CompletedFormPage.scss';
import lottie from 'lottie-web';

const {
    isRegister,
    isProofLoading,
    onProof,
    isProtocolLoading,
    onProtocol
} = useCompletedFormPage();
const completedRef = ref<HTMLElement | null>(null);

onMounted(() => {
    if (completedRef.value) {
        lottie.loadAnimation({
            container: completedRef.value,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: '/animations/completed.json'
        });
    }
});
</script>