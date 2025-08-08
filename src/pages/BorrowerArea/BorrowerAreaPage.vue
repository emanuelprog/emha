<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="borrowerRef" style="width: 130px; max-width: 90vw; height: auto;" />

            <div class="text-h6 text-center q-mb-lg">Área do Mutuário</div>

            <div v-if="loading" class="row justify-center q-my-md">
                <q-spinner color="primary" size="40px" />
            </div>

            <div v-if="showAll && !loading" class="row q-col-gutter-md justify-center"
                style="max-width: 1200px; width: 100%">
                <q-select v-for="(field, key) in selectFields" :key="key" v-model="form[key]" :options="field.options"
                    :option-label="field.optionLabel" :option-value="field.optionValue" :label="field.label" filled
                    :error="validate && !form[key]" :error-message="`O campo ${field.label} é obrigatório`"
                    class="col-12 col-sm-6 col-md-4" />
                <q-input v-model.number="form.number" label="Número" type="number" filled
                    :error="validate && form.number === null" error-message="Campo obrigatório"
                    class="col-12 col-sm-6 col-md-4" />

                <div v-if="(showName || showCpf) && !loading" class="row q-col-gutter-md justify-center"
                    style="max-width: 1200px; width: 100%">
                    <q-input :model-value="contract?.number" label="Código do Contrato" filled readonly
                        class="col-12 col-sm-6 col-md-3" />

                    <q-input :model-value="contract?.sequence" label="Sequencial" filled readonly
                        class="col-12 col-sm-6 col-md-3" />

                    <q-input v-if="showName" v-model="form.name" label="Nome" type="text" filled
                        :error="validate && !form.name" error-message="Campo obrigatório"
                        class="col-12 col-sm-6 col-md-3" />

                    <q-input v-if="showCpf" v-model="form.cpf" label="CPF" type="text" filled
                        :error="validate && !form.cpf" error-message="Campo obrigatório" mask="###.###.###-##"
                        class="col-12 col-sm-6 col-md-3" />
                </div>
            </div>

            <div v-if="showAll" class="row q-gutter-md justify-center q-my-lg">
                <q-btn label="Consultar" color="primary" @click="onSubmit" :disable="loading" />
                <q-btn label="Limpar" color="secondary" @click="onClear" :disable="loading" />
            </div>

            <div v-if="showContractFields && !loading && showAll" class="row q-col-gutter-md"
                style="max-width: 1200px; width: 100%">
                <template v-for="(section, idx) in contractFieldSections" :key="idx">
                    <q-card flat class="q-pt-md col-12 bg-white">
                        <h5 class="text-grey-7 text-center q-mb-md">
                            {{ section.title }}
                        </h5>

                        <div v-if="idx !== contractFieldSections.length" class="row justify-center q-my-md">
                            <hr style="width: 100%; border: 1px solid #ccc;" />
                        </div>

                        <div class="row q-col-gutter-md">
                            <q-input v-for="(field, index) in section.fields" :key="index" :label="field.label"
                                :mask="field.mask" :model-value="getContractValue(field.key)" filled readonly
                                :class="field.cols" />
                        </div>
                    </q-card>
                </template>
            </div>
            <div v-if="showContractFields && !loading && showAll" class="row q-gutter-md justify-center q-my-lg">
                <q-btn label="Extrato de Parcelas" color="primary" @click="onSubmitExtract" :disable="loading" />
                <q-btn label="Limpar" color="secondary" @click="onClear" :disable="loading" />
            </div>

            <div v-if="!showAll && !loading" style="max-width: 1400px; width: 100%">
                <h5 class="text-grey-7 text-center q-mb-md">Parcelas Geradas</h5>
                <div class="row justify-center q-my-md">
                    <hr style="width: 100%; border: 1px solid #ccc;" />
                </div>

                <div class="row q-gutter-md justify-center q-my-lg">
                    <q-btn unelevated rounded color="info" label="2ª Via" icon="description"
                        :loading="isSecondCopyLoading" @click="onSecondCopy" size="lg" class="q-px-xl" />

                    <q-btn unelevated rounded color="info" label="Carnê" icon="request_quote" :loading="isSlipLoading"
                        @click="onSlip" size="lg" class="q-px-xl" />

                    <q-btn unelevated rounded color="info" label="Extrato" icon="receipt_long"
                        :loading="isExtractLoading" @click="onExtract" size="lg" class="q-px-xl" />
                </div>

                <div class="column items-center q-mt-md">
                    <div class="text-positive text-center text-bold">
                        Para imprimir 2º via, selecione uma ou mais parcela(s), conforme imagem!
                    </div>
                    <div class="text-positive text-center text-bold">
                        Para imprimir o Carnê é preciso estar em dia!
                    </div>
                    <div class="text-negative text-center q-mt-sm text-bold">
                        Devido à necessidade de registro do seu boleto junto à CEF, aguardar o período de 24 horas
                        (contado da emissão do boleto) para pagamento!
                    </div>
                </div>

                <div class="row items-center q-gutter-md q-mt-md q-ml-md" style="flex-wrap: wrap;">
                    <div class="row items-center q-gutter-xs q-mr-md" style="font-size: 16px;">
                        <q-icon name="circle" style="font-size: 18px; color: #098f7c;" />
                        <span>Pagas</span>
                    </div>

                    <div class="row items-center q-gutter-xs q-mr-md" style="font-size: 16px;">
                        <q-icon name="circle" style="font-size: 18px; color: #fefeb0;" />
                        <span>À Vencer</span>
                    </div>

                    <div class="row items-center q-gutter-xs q-mr-md" style="font-size: 16px;">
                        <q-icon name="circle" style="font-size: 18px; color: #ff3f3f;" />
                        <span>Vencidas</span>
                    </div>

                    <div class="row items-center q-gutter-xs q-mr-md" style="font-size: 16px;">
                        <q-icon name="circle" style="font-size: 18px; color: #87cefa;" />
                        <span>Bônus</span>
                    </div>

                    <div class="row items-center q-gutter-xs q-mr-md" style="font-size: 16px;">
                        <q-icon name="circle" style="font-size: 18px; color: #999999;" />
                        <span>Taxas</span>
                    </div>

                    <div class="row items-center q-gutter-xs q-mr-md" style="font-size: 16px;">
                        <q-icon name="circle" style="font-size: 18px; color: #20124d;" />
                        <span>Aditivo-Padrão de Energia</span>
                    </div>

                    <div class="row items-center q-gutter-xs q-mr-md" style="font-size: 16px;">
                        <q-icon name="circle" style="font-size: 18px; color: #783f04;" />
                        <span>Aditivo-Mão de Obra</span>
                    </div>
                </div>


                <div class="q-pa-md">
                    <q-table :rows="debts" :columns="columns" row-key="id" flat bordered
                        :rows-per-page-options="[10, 20, 50, 0]" separator="horizontal"
                        :table-class="$q.dark.isActive ? 'table-dark' : 'table-light'">
                        <template v-slot:header="props">
                            <q-tr :props="props">
                                <q-th auto-width>
                                    <q-checkbox :model-value="allSelected"
                                        :indeterminate="selectedDebts.length > 0 && !allSelected"
                                        @update:model-value="toggleSelectAll" color="primary" />
                                </q-th>

                                <q-th v-for="col in props.cols.slice(1)" :key="col.name" :props="props">
                                    {{ col.label }}
                                </q-th>
                            </q-tr>
                        </template>

                        <template v-slot:body="props">
                            <q-tr :props="props" :style="props.row.color">
                                <q-td auto-width>
                                    <q-checkbox :model-value="isDebtSelected(props.row)"
                                        @update:model-value="toggleDebtSelection(props.row)" color="primary" />
                                </q-td>

                                <q-td v-for="col in props.cols.slice(1)" :key="col.name" :props="props">
                                    {{ col.value }}
                                </q-td>
                            </q-tr>
                        </template>

                        <template v-slot:bottom-row>
                            <q-tr :class="$q.dark.isActive ? 'bg-primary text-white' : 'bg-primary text-white'">
                                <q-td class="text-bold">Totais</q-td>
                                <q-td align="left">{{ debts.length }}</q-td>
                                <q-td></q-td>
                                <q-td align="center">{{ sumField('originalValueFormatted') }}</q-td>
                                <q-td align="center">{{ sumField('discountFormatted') }}</q-td>
                                <q-td align="center">{{ sumField('valueWithDiscount') }}</q-td>
                                <q-td align="center">{{ sumField('additionalFormatted') }}</q-td>
                                <q-td align="center">{{ sumField('interestFormatted') }}</q-td>
                                <q-td align="center">{{ sumField('fineFormatted') }}</q-td>
                                <q-td align="center">{{ sumField('additionalFormatted') }}</q-td>
                                <q-td align="center">{{ sumField('totalFormatted') }}</q-td>
                                <q-td align="center">{{ sumField('paymentValueFormatted') }}</q-td>
                                <q-td />
                            </q-tr>
                        </template>
                    </q-table>
                </div>

                <div class="row q-gutter-md justify-center q-my-lg">
                    <q-btn label="Voltar" color="primary" @click="onBack" />
                </div>
            </div>

        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useBorrowerAreaPage } from './BorrowerAreaPage';
import './BorrowerAreaPage.scss';
import lottie from 'lottie-web';

const borrowerRef = ref<HTMLElement | null>(null);

const {
    loading,
    isSecondCopyLoading,
    isSlipLoading,
    isExtractLoading,
    form,
    contract,
    selectFields,
    validate,
    showAll,
    showCpf,
    showName,
    showContractFields,
    contractFieldSections,
    getContractValue,
    loadOptions,
    onSubmit,
    onClear,
    onSubmitExtract,
    onBack,
    onSecondCopy,
    onSlip,
    onExtract,
    columns,
    debts,
    sumField,
    isDebtSelected,
    toggleDebtSelection,
    selectedDebts,
    allSelected,
    toggleSelectAll
} = useBorrowerAreaPage();

onMounted(async () => {
    if (borrowerRef.value) {
        lottie.loadAnimation({
            container: borrowerRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/animations/borrower.json',
        });
    }

    await loadOptions()
});
</script>