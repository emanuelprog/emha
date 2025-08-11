<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="registerRef" class="q-mb-md" style="width: 100px; max-width: 90vw; height: auto;" />

            <div class="text-h6 q-mt-sm q-mb-md">Termos de Aceite</div>

            <q-card flat bordered style="max-width: 1100px; width: 100%;">
                <q-card-section v-if="hasEvent">
                    <div class="term-content" v-html="safeHtml"></div>
                </q-card-section>

                <q-card-section v-else>
                    <q-banner dense rounded class="bg-orange-2 text-orange-9">
                        Nenhum evento selecionado. Volte e escolha um evento para continuar.
                    </q-banner>
                </q-card-section>

                <q-separator />

                <q-card-actions align="between" class="q-pa-md">
                    <q-btn label="Voltar" color="grey-7" flat @click="onBack" />
                    <div class="row items-center q-gutter-sm">
                        <q-checkbox v-model="accepted" :true-value="true" :false-value="false"
                            label="Li e concordo com as informações" :disable="!hasEvent" />
                        <q-btn label="Avançar" color="primary" :disable="!hasEvent || !accepted" @click="onNext" />
                    </div>
                </q-card-actions>
            </q-card>

        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useEventTermAcceptedPage } from './EventTermAcceptedPage';
import './EventTermAcceptedPage.scss';
import lottie from 'lottie-web'

const { hasEvent, safeHtml, accepted, onBack, onNext } = useEventTermAcceptedPage();
const registerRef = ref<HTMLElement | null>(null)

onMounted(() => {
    if (registerRef.value) {
        lottie.loadAnimation({
            container: registerRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/animations/register.json'
        })
    }
})
</script>