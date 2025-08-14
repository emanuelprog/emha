<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="registerRef" class="q-mb-md" style="width: 100px; max-width: 90vw; height: auto;" />

            <div class="text-h6 q-mt-sm q-mb-md">Termos Documento</div>

            <q-card flat bordered style="max-width: 1100px; width: 100%;">
                <q-card-section>
                    <h5 class="text-center q-mb-md">
                        Documentos originais necessários para realizar e/ou atualizar o cadastro
                    </h5>

                    <ol class="q-pl-lg">
                        <li>Documento de identidade com foto (RG, CNH, Carteira Profissional, Carteira de trabalho)
                            dentro da validade (casal);</li>
                        <li>CPF (casal);</li>
                        <li>Certidão que comprove o estado civil;</li>
                        <li>NIS – Número de Identificação Social (atualizado nos últimos 2 anos) do grupo familiar, com
                            apresentação da Folha Resumo do Cadastro Único;</li>
                        <li>CID – caso o cadastrado ou dependente da família possua deficiência e/ou doenças crônicas
                            incapacitantes ao trabalho (declaração/atestado cedido pelo médico);</li>
                        <li>Título de Eleitor (de Campo Grande-MS), conforme Ac.-TSE nº 16.397/2000 e 18.124/2000;</li>
                        <li>Comprovante de residência atualizado (quando houver);</li>
                        <li>Comprovante de renda ou declaração de rendimentos (quando houver);</li>
                    </ol>

                    <p class="q-mt-md">
                        <strong>Observação:</strong> O interessado deve apresentar no ato do cadastro os documentos
                        originais,
                        em bom estado de conservação, legíveis, livre de rasuras e com eventuais averbações realizadas.
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
import { useRegisterTermDocumentPage } from './RegisterTermDocumentPage';
import './RegisterTermDocumentPage.scss';
import lottie from 'lottie-web'

const { accepted, onBack, onNext } = useRegisterTermDocumentPage();
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