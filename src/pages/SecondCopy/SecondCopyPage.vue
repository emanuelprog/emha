<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="secondCopyRef" style="width: 220px; max-width: 90vw; height: auto;" />

            <div class="text-h6 text-center q-mb-lg">2ª Via de Protocolo</div>

            <div v-if="loading" class="row justify-center q-my-md">
                <q-spinner color="primary" size="40px" />
            </div>

            <div v-if="showAll && !loading" class="row q-col-gutter-md justify-center"
                style="max-width: 1200px; width: 100%">
                <q-input v-model.number="form.number" label="Número do Protocolo" type="number" filled
                    :error="validate && form.number === null" error-message="Campo obrigatório"
                    class="col-12 col-sm-6 col-md-3" />

                <q-input v-model="form.cpf" label="CPF" filled :error="validate && !form.cpf"
                    error-message="Campo obrigatório" class="col-12 col-sm-6 col-md-3" mask="###.###.###-##" />

                <q-input :model-value="personOnline?.name" label="Nome Completo" filled readonly
                    class="col-12 col-sm-6 col-md-6" />
            </div>

            <div v-if="showAll" class="row q-gutter-md justify-center q-my-lg">
                <q-btn label="Consultar" color="primary" @click="onSubmit" :disable="loading" />
                <q-btn label="Limpar" color="secondary" @click="onClear" :disable="loading" />
            </div>

            <div v-if="showValidateRegister && !showAll && !loading" class="row q-col-gutter-md justify-center"
                style="max-width: 1200px; width: 100%">
                <q-input v-model.number="form.nis" label="Informe o NIS" type="number" filled
                    :error="validate && form.nis === ''" error-message="Campo obrigatório"
                    class="col-12 col-sm-6 col-md-3" />
            </div>

            <div v-if="showValidateRegister && !showAll && !loading" class="row q-gutter-md justify-center q-my-lg">
                <q-btn label="Validar" color="primary" @click="onValidate" :disable="loading" />
                <q-btn label="Voltar" flat color="secondary" @click="onBackValidate" :disable="loading" />
            </div>

            <div v-if="showSelection" class="row q-gutter-md justify-center q-my-lg">
                <q-btn label="Inscrições do Evento" color="primary" @click="onSelectInscriptionsEvent" />
                <q-btn label="Protocolo" color="primary" @click="onSelectRegister" />
                <q-btn label="Voltar" flat color="secondary" @click="onBackSelection" :disable="loading" />
            </div>

            <div v-if="showPersonOnlineFields && !loading && showAll" class="row q-col-gutter-md"
                style="max-width: 1200px; width: 100%">
                <template v-for="(section, idx) in personOnlineFieldSections" :key="idx">
                    <q-card flat class="q-pt-md col-12 bg-white">
                        <h5 class="text-grey-7 text-center q-mb-md">
                            {{ section.title }}
                        </h5>

                        <div v-if="idx !== personOnlineFieldSections.length" class="row justify-center q-my-md">
                            <hr style="width: 100%; border: 1px solid #ccc;" />
                        </div>

                        <div class="row q-col-gutter-md">
                            <template v-for="(field, index) in section.fields" :key="index">
                                <q-input v-if="field.type === 'text'" type="text" :label="field.label"
                                    :mask="field.mask" :model-value="getPersonOnlineValue(field.key)" filled readonly
                                    :class="field.cols" />

                                <q-input v-if="field.type === 'number'" type="number" :label="field.label"
                                    :mask="field.mask" :model-value="getPersonOnlineValue(field.key)" filled readonly
                                    :class="field.cols" />

                                <q-checkbox v-if="field.type === 'checkbox'" :label="field.label" type="checkbox"
                                    :model-value="getPersonOnlineValue(field.key)" :class="field.cols + ' q-mt-sm'"
                                    disable />
                            </template>
                        </div>
                    </q-card>
                </template>
            </div>

            <div v-if="showPersonOnlineFields && !loading && showAll" class="row q-gutter-md justify-center q-my-lg">
                <q-btn label="Imprimir Protocolo" color="primary" @click="onPrintSecondCopy" :disable="loading"
                    :loading="isSecondCopyLoading" />
                <q-btn label="Voltar" flat color="secondary" @click="onBackRegister" :disable="loading" />
            </div>

            <div v-if="showEvent && !loading">
                <div v-if="showEvent && !loading" class="q-mt-xl"
                    style="width: 100%; max-width: 1200px; min-width: 1200px;">
                    <q-table title="Inscrições do Evento" :rows="inscriptions" :columns="columns" row-key="id"
                        :pagination="pagination" :loading="loading" flat bordered dense hide-bottom
                        no-data-label="Nenhuma inscrição encontrada.">
                        <template #body-cell-actions="props">
                            <q-td :props="props">
                                <q-btn color="primary" icon="print" dense flat
                                    @click="onPrintInscription(props.row.id)" />
                            </q-td>
                        </template>
                    </q-table>
                </div>
            </div>

            <div v-if="showEvent && !loading" class="row q-gutter-md justify-center q-my-lg">
                <q-btn label="Voltar" flat color="secondary" @click="onBackEvent" :disable="loading" />
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSecondCopyPage } from './SecondCopyPage';
import './SecondCopyPage.scss';
import lottie from 'lottie-web';

const secondCopyRef = ref<HTMLElement | null>(null);

const {
    loading,
    form,
    personOnline,
    validate,
    showAll,
    showPersonOnlineFields,
    personOnlineFieldSections,
    getPersonOnlineValue,
    onSubmit,
    onClear,
    onValidate,
    onBackValidate,
    onPrintSecondCopy,
    isSecondCopyLoading,
    showValidateRegister,
    showSelection,
    onSelectInscriptionsEvent,
    onSelectRegister,
    onBackSelection,
    showEvent,
    inscriptions,
    columns,
    pagination,
    onPrintInscription,
    onBackRegister,
    onBackEvent
} = useSecondCopyPage();

onMounted(() => {
    if (secondCopyRef.value) {
        lottie.loadAnimation({
            container: secondCopyRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/animations/second-copy.json',
        });
    }
});
</script>