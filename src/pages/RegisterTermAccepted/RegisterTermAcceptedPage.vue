<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="registerRef" class="q-mb-md" style="width: 100px; max-width: 90vw; height: auto;" />

            <div class="text-h6 q-mt-sm q-mb-md">Termos Aceite</div>

            <q-card flat bordered style="max-width: 1100px; width: 100%;">
                <q-card-section>
                    <p style="text-align: justify;">
                        O interessado cadastrado no Cadastro Online da AGÊNCIA MUNICIPAL DE HABITAÇÃO E ASSUNTOS
                        FUNDIÁRIOS - EMHA, para fins de concorrer a benefícios de programas habitacionais desenvolvidos
                        por esta Agência e pelo Governo Federal, FICA CIENTE QUE: <br> <br>
                        1) O Cadastro é TOTALMENTE GRATUITO e INTRANSFERÍVEL; <br>
                        2) A ordem cronológica de cadastro (TEMPO de inscrição) não é critério de seleção; <br>
                        3) O comprovante de cadastro apenas confirma o cadastramento online, não gerando direitos;<br>
                        4) O benefício pretendido deverá ser destinado para a sua residência e de seus familiares<br>
                        5) Para a concessão do benefício é necessário que o interessado informe o NIS (Número de
                        Identificação Social).<br>
                        6) Não poderá ser proprietário de imóveis, promitente comprador ou que tenha recebido benefício
                        ou subsídios de políticas de habitação de interesse social em qualquer parte do território
                        nacional;<br>
                        7) O cadastro é FACULTATIVO, quando realizado deve ser atualizado ANUALMENTE, ou sempre que
                        houver alteração de quaisquer dados. Para participar de processos de seleção é OBRIGATÓRIA a
                        inscrição no empreendimento de interesse;<br>
                        8) A responsabilidade pelas informações prestadas é do cadastrado e, após análise, se verificado
                        dados ou informações falsas o mesmo será eliminado automaticamente do processo de seleção;<br>
                        9) As informações prestadas deverão ser comprovadas quando solicitadas no processo de seleção
                        devendo ser apresentados documentos originais, em bom estado de conservação, legíveis, livre de
                        rasuras e com eventuais averbações realizadas.
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
import { useRegisterTermAcceptedPage } from './RegisterTermAcceptedPage';
import './RegisterTermAcceptedPage.scss';
import lottie from 'lottie-web'

const { accepted, onBack, onNext } = useRegisterTermAcceptedPage();
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