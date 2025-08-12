<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="registerRef" class="q-mb-md" style="width: 100px; max-width: 90vw; height: auto;" />

            <div class="text-h6 q-mt-sm q-mb-md">Seleção Módulo do Evento</div>

            <div flat bordered style="max-width: 1100px; width: 100%;">
                <div class="row q-col-gutter-md">
                    <q-select v-model="selectedModule" :options="moduleOptions" option-value="id"
                        option-label="description" label="Selecionar Módulo" filled class="col-12 col-sm-6 col-md-12"
                        :error="validate && !selectedModule" :disable="!hasEvent"
                        error-message="O campo é obrigatório" />
                </div>

                <q-separator />

                <q-card-actions align="between" class="q-pa-md q-mt-md">
                    <q-btn label="Voltar" color="grey-7" flat @click="onBack" />
                    <q-btn label="Avançar" color="primary" @click="onNext" />
                </q-card-actions>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useEventModulePage } from './EventModulePage';
import './EventModulePage.scss';
import lottie from 'lottie-web'

const { validate, hasEvent, selectedModule, moduleOptions, loadOption, onBack, onNext } = useEventModulePage();
const registerRef = ref<HTMLElement | null>(null)

onMounted(async () => {
    if (registerRef.value) {
        lottie.loadAnimation({
            container: registerRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/animations/register.json'
        })
    }

    await loadOption();
})
</script>