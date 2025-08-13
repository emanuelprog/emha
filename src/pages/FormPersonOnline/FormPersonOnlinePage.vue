<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="registerRef" class="q-mb-md" style="width: 120px; max-width: 90vw; height: auto;" />

            <div v-if="personOnline" flat bordered style="max-width: 1100px; width: 100%;">
                <div class="row q-col-gutter-md">
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
                                    <q-input
                                        v-if="field.type === 'text' && field.key !== 'income' && field.key !== 'formattedRentValue' && evalCond(field, personOnline)"
                                        type="text" :label="field.label" :mask="field.mask" :title="field.label"
                                        :model-value="getPersonOnlineString(field.key)" filled :disable="field.disable"
                                        @update:model-value="setPersonOnlineValue(field.key, $event)"
                                        :error="hasError(field)" :error-message="getErrorMessage(field)"
                                        :data-key="field.key" :class="field.cols" />

                                    <q-input v-if="field.type === 'number' && evalCond(field, personOnline)"
                                        type="number" :label="field.label" :mask="field.mask" :title="field.label"
                                        :model-value="getPersonOnlineNumber(field.key)" filled :disable="field.disable"
                                        @update:model-value="setPersonOnlineValue(field.key, $event !== '' ? Number($event) : null)"
                                        :data-key="field.key" :error="hasError(field)"
                                        :error-message="getErrorMessage(field)" :class="field.cols" />

                                    <q-input
                                        v-if="field.key === 'income' || field.key === 'formattedRentValue' && evalCond(field, personOnline)"
                                        :label="field.label" v-model.number="incomeModel" inputmode="numeric" filled
                                        :data-key="field.key" :disable="field.disable" :class="field.cols" />

                                    <q-select v-if="field.type === 'select' && evalCond(field, personOnline)"
                                        :label="field.label" :options="field.options || []" option-label="label"
                                        option-value="value" emit-value map-options
                                        :model-value="getPersonOnlineSelect(field.key)" filled :disable="field.disable"
                                        :data-key="field.key" :error="hasError(field)"
                                        :error-message="getErrorMessage(field)"
                                        @update:model-value="setPersonOnlineValue(field.key, $event)"
                                        :class="field.cols" />

                                    <div v-if="field.type === 'radio' && evalCond(field, personOnline)"
                                        :class="field.cols">
                                        <div class="text-subtitle2 q-mb-xs">
                                            {{ field.label }}
                                            <q-icon v-if="field.info" name="help" size="16px"
                                                class="q-ml-xs cursor-pointer" color="primary">
                                                <q-tooltip anchor="top middle" self="bottom middle">
                                                    {{ field.info }}
                                                </q-tooltip>
                                            </q-icon>
                                        </div>
                                        <q-option-group type="radio" :options="field.options || []"
                                            :model-value="getPersonOnlineValue(field.key, field.type)" inline
                                            @update:model-value="setPersonOnlineValue(field.key, $event)"
                                            :data-key="field.key" :error="hasError(field)"
                                            :error-message="getErrorMessage(field)" :disable="field.disable" />
                                    </div>

                                    <div v-if="field.type === 'checkbox' && evalCond(field, personOnline)"
                                        :class="field.cols">
                                        <q-checkbox v-if="field.type === 'checkbox' && evalCond(field, personOnline)"
                                            :label="field.label" :model-value="getPersonOnlineBoolean(field.key)"
                                            :data-key="field.key"
                                            @update:model-value="setPersonOnlineValue(field.key, $event)"
                                            :error="hasError(field)" :error-message="getErrorMessage(field)"
                                            :disable="field.disable" />
                                        <q-icon v-if="field.info" name="help" size="16px" class="q-ml-xs cursor-pointer"
                                            color="primary">
                                            <q-tooltip anchor="top middle" self="bottom middle">
                                                {{ field.info }}
                                            </q-tooltip>
                                        </q-icon>
                                    </div>

                                    <q-input v-if="field.type === 'date' && evalCond(field, personOnline)"
                                        :label="field.label" :mask="field.mask || '##/##/####'" :title="field.label"
                                        :model-value="getPersonOnlineString(field.key)" filled :class="field.cols"
                                        :data-key="field.key" :error="hasError(field)"
                                        :error-message="getErrorMessage(field)"
                                        @update:model-value="setPersonOnlineValue(field.key, $event)"
                                        :disable="field.disable">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer"
                                                :disable="getPersonOnlineString(field.key)">
                                                <q-popup-proxy :disable="getPersonOnlineString(field.key)">
                                                    <q-date :model-value="getPersonOnlineString(field.key)"
                                                        mask="DD/MM/YYYY" />
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </template>
                            </div>
                        </q-card>

                        <div v-if="section.title === 'Dependentes'" class="q-gutter-y-md" style="width:100%;">
                            <div class="row q-col-gutter-md items-start">

                                <div v-if="mainDependent?.totalChronicDiseases != null && mainDependent.totalChronicDiseases > 0"
                                    class="col-12 col-md-6">
                                    <div class="row items-center no-wrap q-mb-sm">
                                        <div class="col">
                                            <div class="text-subtitle2 text-weight-medium">Doença Crônica</div>
                                        </div>
                                        <div class="col-auto">
                                            <q-btn label="Novo" color="primary" icon="add"
                                                @click="openDependentDialog('chronic')" />
                                        </div>
                                    </div>

                                    <q-table flat dense square hide-bottom separator="cell" :rows="chronicDiseaseRows"
                                        :columns="chronicColumns"
                                        :table-class="$q.dark.isActive ? 'table-dark' : 'table-light'"
                                        style="width:100%;" row-key="__key" />
                                </div>

                                <div v-if="mainDependent?.totalWithDisability != null && mainDependent.totalWithDisability > 0"
                                    class="col-12 col-md-6">
                                    <div class="row items-center no-wrap q-mb-sm">
                                        <div class="col">
                                            <div class="text-subtitle2 text-weight-medium">Deficiência</div>
                                        </div>
                                        <div class="col-auto">
                                            <q-btn label="Novo" color="primary" icon="add"
                                                @click="openDependentDialog('disability')" />
                                        </div>
                                    </div>

                                    <q-table flat dense square hide-bottom separator="cell" :rows="disabilityRows"
                                        :columns="disabilityColumns"
                                        :table-class="$q.dark.isActive ? 'table-dark' : 'table-light'"
                                        style="width:100%;" row-key="__key" />
                                </div>

                            </div>

                            <q-dialog v-model="showDependentDialog" persistent>
                                <q-card style="min-width: 400px;">
                                    <q-card-section>
                                        <div class="text-h6">
                                            {{ dependentType === 'chronic'
                                                ? 'Novo Dependente - Doença Crônica'
                                                : 'Novo Dependente - Deficiência' }}
                                        </div>
                                    </q-card-section>

                                    <q-card-section>
                                        <q-input v-model="dependentForm.dependentsWithDisabilitiesNames"
                                            label="Nome do Dependente" dense outlined />
                                        <q-input v-model="dependentForm.descriptionOfDisabilities" label="Descrição"
                                            dense outlined class="q-mt-sm" />
                                        <q-toggle v-if="dependentType === 'chronic'"
                                            v-model="dependentForm.hasDegenerativeDisease" label="Doença Degenerativa"
                                            class="q-mt-sm" />
                                    </q-card-section>

                                    <q-card-actions align="right">
                                        <q-btn flat label="Cancelar" v-close-popup />
                                        <q-btn color="primary" label="Salvar" @click="saveDependent" />
                                    </q-card-actions>
                                </q-card>
                            </q-dialog>
                        </div>
                    </template>
                </div>

                <q-separator class="q-mt-md" />

                <q-card-actions align="between" class="q-pa-md">
                    <q-btn label="Voltar" color="grey-7" flat @click="onBack" />
                    <div class="row items-center q-gutter-sm">
                        <q-btn :label="isRegister ? 'Cadastrar' : 'Inscrever'" color="positive" @click="onSubmit" />
                    </div>
                </q-card-actions>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useFormPersonOnlinePage } from './FormPersonOnlinePage';
import './FormPersonOnlinePage.scss';
import lottie from 'lottie-web';

const {
    personOnline,
    onSubmit,
    onBack,
    loadPersonOnline,
    isRegister,
    personOnlineFieldSections,
    getPersonOnlineValue,
    evalCond,
    getPersonOnlineString,
    getPersonOnlineNumber,
    getPersonOnlineBoolean,
    getPersonOnlineSelect,
    loadSelectOptions,
    chronicColumns,
    disabilityColumns,
    chronicDiseaseRows,
    disabilityRows,
    setPersonOnlineValue,
    incomeModel,
    hasError,
    getErrorMessage,
    mainDependent,
    openDependentDialog,
    dependentForm,
    showDependentDialog,
    dependentType,
    saveDependent
} = useFormPersonOnlinePage();
const registerRef = ref<HTMLElement | null>(null);

onMounted(async () => {
    if (registerRef.value) {
        lottie.loadAnimation({
            container: registerRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/animations/register.json'
        });
    }

    loadPersonOnline();
    await loadSelectOptions();
});
</script>