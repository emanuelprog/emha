<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="registerRef" class="q-mb-md" style="width: 100px; max-width: 90vw; height: auto;" />

            <div class="text-h6 q-mt-sm q-mb-md">Termos Requisito</div>

            <q-card flat bordered style="max-width: 1100px; width: 100%;">
                <q-card-section>
                    <p style="text-align: justify;">
                        O cadastrado para receber benefício de habitação de interesse social junto ao Município de Campo
                        Grande ou aquisição de direitos sobre os imóveis da carteira imobiliária da AGÊNCIA MUNICIPAL DE
                        HABITAÇÃO E ASSUNTOS FUNDIÁRIOS por meio de quaisquer das modalidades de benefício previstas,
                        está <strong>VEDADA</strong> aos interessados que:
                        <br /><br />
                        I — não sejam brasileiros natos ou naturalizados;<br />
                        II — sejam proprietários de imóveis ou já tenham recebido benefício ou subsídios de políticas de
                        habitação de interesse social em qualquer parte do território nacional;<br />
                        III — figurem ou tenham figurado como beneficiários dos programas habitacionais da AGÊNCIA
                        MUNICIPAL DE HABITAÇÃO E ASSUNTOS FUNDIÁRIOS, da Agência Estadual de Habitação Popular do Estado
                        de Mato Grosso do Sul — AGEHAB ou de outros agentes promotores de programas habitacionais de
                        interesse social;<br />
                        IV — figurem como beneficiários de imóvel de interesse social no Cadastro Nacional de Mutuários
                        - CADMUT;<br />
                        V — tenham renda familiar superior a 3 (três) vezes o salário mínimo vigente no país;<br />
                        VI — não cumpram com as exigências previstas na Política Municipal de Habitação de Interesse
                        Social — POLHIS.
                    </p>
                </q-card-section>

                <q-separator />

                <q-card-actions align="between" class="q-pa-md">
                    <q-btn label="Voltar" color="grey-7" flat @click="onBack" />
                    <div class="row items-center q-gutter-sm">
                        <q-checkbox v-model="accepted" :true-value="true" :false-value="false"
                            label="Li e concordo com as informações" />
                        <q-btn label="Avançar" color="primary" :disable="!accepted" @click="onNext" />
                    </div>
                </q-card-actions>
            </q-card>

        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRegisterTermRequirementPage } from './RegisterTermRequirementPage';
import './RegisterTermRequirementPage.scss';
import lottie from 'lottie-web'

const { accepted, onBack, onNext } = useRegisterTermRequirementPage();
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