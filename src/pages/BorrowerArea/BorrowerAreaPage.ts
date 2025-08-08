import axios from 'axios';
import type { QTableColumn } from 'quasar';
import { fetchCommercialModules } from 'src/services/commercialModuleService';
import { fetchContractByCommercialModuleAndHousingComplexesAndNumber } from 'src/services/contractService';
import { fetchDebtsByContract, fetchExtractByContract, fetchSecondCopyByDebts, fetchSlipByDebts } from 'src/services/debtService';
import { fetchHousingComplexesByCommercialModule } from 'src/services/housingComplexesService';
import { notifyError, notifyWarning } from 'src/services/messageService';
import type { CommercialModuleType } from 'src/types/commercialModuleType';
import type { ContractType } from 'src/types/contractType';
import type { DebtType } from 'src/types/debtType';
import type { HousingComplexesType } from 'src/types/housingComplexesType';
import { formatDate } from 'src/util/dateUtil';
import { formatCurrencyBRL } from 'src/util/formatUtil';
import { computed, ref, watch } from 'vue';


interface FormModel {
    commercialModule: CommercialModuleType | null;
    housingComplexes: HousingComplexesType | null;
    number: number | null;
    name: string;
    cpf: string;
}

const initialFilters: FormModel = {
    commercialModule: null,
    housingComplexes: null,
    number: null,
    name: '',
    cpf: ''
};

const selectFields = ref({
    commercialModule: {
        label: 'Módulo Comercial',
        optionLabel: 'description',
        optionValue: 'id',
        options: [] as CommercialModuleType[]
    },
    housingComplexes: {
        label: 'Conjunto',
        optionLabel: 'description',
        optionValue: 'id',
        options: [] as HousingComplexesType[]
    },
})

const contractFieldSections = ref([
    {
        title: 'Contrato',
        fields: [
            { key: 'operation.description', label: 'Tipo de Contrato', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'number', label: 'Código do Contrato', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'sequence', label: 'Sequencial', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'contractDate', label: 'Data do Contrato', cols: 'col-12 col-sm-6 col-md-3', mask: '' }
        ]
    },
    {
        title: 'Informações do Imóvel',
        fields: [
            { key: 'commercialModule.description', label: 'Módulo Comercial', cols: 'col-12 col-sm-6 col-md-4', mask: '' },
            { key: 'housingComplexes.description', label: 'Conjunto', cols: 'col-12 col-sm-6 col-md-4', mask: '' },
            { key: 'batch.block', label: 'Quadra', cols: 'col-12 col-sm-6 col-md-2', mask: '' },
            { key: 'batch.description', label: 'Lote', cols: 'col-12 col-sm-6 col-md-2', mask: '' },
            { key: 'batch.address', label: 'Logradouro', cols: 'col-12 col-sm-6 col-md-8', mask: '' },
            { key: 'batch.addressNumber', label: 'Número', cols: 'col-12 col-sm-6 col-md-4', mask: '' },
        ]
    },
    {
        title: 'Titular',
        fields: [
            { key: 'person.id', label: 'Código', cols: 'col-12 col-sm-6 col-md-4', mask: '' },
            { key: 'person.name', label: 'Nome', cols: 'col-12 col-sm-6 col-md-4', mask: '' },
            { key: 'person.cpf', label: 'CPF', cols: 'col-12 col-sm-6 col-md-4', mask: '###.###.###-##' }
        ]
    },
    {
        title: 'Financiamento',
        fields: [
            { key: 'socialGuarantee', label: 'Garantia Social', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'charge', label: 'Cobrança', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'nonChargeReason', label: 'Motivo da Não Cobrança', cols: 'col-12 col-sm-6 col-md-6', mask: '' },
            { key: 'lotteryNotes.description', label: 'Observação', cols: 'col-12 col-sm-6 col-md-12', mask: '' },
            { key: 'squareMeterValue', label: 'Valor do m²', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'propertyValue', label: 'Valor do Imóvel', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'compensationValue', label: 'Valor Indenização', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'financedValue', label: 'Valor Financiado', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'entryValue', label: 'Valor da Entrada', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'installmentValue', label: 'Valor das Parcelas', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'chosenInstallmentDueDay', label: 'Dia de Vencimento Parcelas', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'term', label: 'Prazo', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'index.chart.chartDescription', label: 'Reajuste', cols: 'col-12 col-sm-6 col-md-3', mask: '' },
            { key: 'index.discountPercentage', label: '% de Desconto', cols: 'col-12 col-sm-6 col-md-3', mask: '' }
        ]
    }
]);


const form = ref<FormModel>({ ...initialFilters });
const validate = ref(false);
const loading = ref(false);
const showAll = ref(true);
const showCpf = ref(false);
const showName = ref(false);
const showContractFields = ref(false);
const isSecondCopyLoading = ref(false);
const isSlipLoading = ref(false);
const isExtractLoading = ref(false);

const contract = ref<ContractType | null>(null);
const columns = ref<QTableColumn<DebtType>[]>([
    { name: 'checkbox', label: '', field: () => '', align: 'left' },
    { name: 'installmentNumber', label: 'Parc.', field: 'installmentNumber', align: 'left', sortable: true },
    { name: 'dueDate', label: 'Vencimento', field: 'dueDate', align: 'left', sortable: true },
    {
        name: 'originalValueFormatted',
        label: 'Valor S/ Desc.',
        field: 'originalValueFormatted',
        align: 'right',
        format: val => formatCurrencyBRL(val)
    },
    {
        name: 'discountFormatted',
        label: 'Desconto',
        field: 'discountFormatted',
        align: 'right',
        format: val => formatCurrencyBRL(val)
    },
    {
        name: 'valueWithDiscount',
        label: 'Valor C/ Desc.',
        field: 'valueWithDiscount',
        align: 'right',
        format: val => formatCurrencyBRL(val)
    },
    {
        name: 'additionalFormatted',
        label: 'Desc. Adic.',
        field: 'additionalFormatted',
        align: 'right',
        format: val => formatCurrencyBRL(val)
    },
    {
        name: 'interestFormatted',
        label: 'Juros',
        field: 'interestFormatted',
        align: 'right',
        format: val => formatCurrencyBRL(val)
    },
    {
        name: 'fineFormatted',
        label: 'Multa',
        field: 'fineFormatted',
        align: 'right',
        format: val => formatCurrencyBRL(val)
    },
    {
        name: 'additionalFormatted',
        label: 'Valor Adic.',
        field: 'additionalFormatted',
        align: 'right',
        format: val => formatCurrencyBRL(val)
    },
    {
        name: 'totalFormatted',
        label: 'Valor a Pagar',
        field: 'totalFormatted',
        align: 'right',
        format: val => formatCurrencyBRL(val)
    },
    {
        name: 'paymentValueFormatted',
        label: 'Valor Pago',
        field: 'paymentValueFormatted',
        align: 'right',
        format: val => formatCurrencyBRL(val)
    },
    {
        name: 'paymentDate',
        label: 'Data do Pagamento',
        field: 'paymentDate',
        align: 'left'
    }
]);

const debts = ref<DebtType[]>([]);
const selectedDebts = ref<DebtType[]>([]);

async function loadOptions() {
    const [commercialModuleRes] = await Promise.all([
        fetchCommercialModules()
    ]);

    selectFields.value.commercialModule.options = Array.isArray(commercialModuleRes)
        ? [...commercialModuleRes].sort((a, b) => a.description.localeCompare(b.description))
        : [];
}

watch(
    () => form.value.commercialModule,
    (commercialModule) => {
        form.value.housingComplexes = null;

        if (commercialModule?.id) {
            void fetchHousingComplexesByCommercialModule(commercialModule.id).then((res) => {
                selectFields.value.housingComplexes.options = Array.isArray(res)
                    ? [...res].sort((a, b) => a.description.localeCompare(b.description))
                    : [];
            });
        }
    }
);

function onClear() {
    form.value = { ...initialFilters };
    validate.value = false;
    showCpf.value = false;
    showName.value = false;
    showContractFields.value = false;
    contract.value = null;
    showAll.value = true;
}

function isSameFilters(): boolean | null {
    return (
        contract.value &&
        form.value.number === contract.value.number &&
        form.value.commercialModule?.id === contract.value.commercialModule?.id &&
        form.value.housingComplexes?.id === contract.value.housingComplexes?.id
    );
}

function validateByName(): boolean {
    if (form.value.name === contract.value?.person?.name) {
        showName.value = false;
        showCpf.value = false;
        showContractFields.value = true;
        return true;
    } else {
        notifyWarning("Nome Inválido. Tente com o CPF!");
        showName.value = false;
        showCpf.value = true;
        return false;
    }
}

function validateByCpf(): boolean {
    const enteredCpf = form.value.cpf.replace(/\D/g, '');
    const contractCpf = contract.value?.person?.cpf?.replace(/\D/g, '');

    if (enteredCpf === contractCpf) {
        showName.value = false;
        showCpf.value = false;
        showContractFields.value = true;
        return true;
    } else {
        notifyWarning("CPF Inválido. Tente com o nome!");
        showName.value = true;
        showCpf.value = false;
        return false;
    }
}

async function fetchContract(): Promise<void> {
    try {
        const res = await fetchContractByCommercialModuleAndHousingComplexesAndNumber(
            form.value.commercialModule!.id,
            form.value.housingComplexes!.id,
            form.value.number!
        );

        contract.value = res;
        showName.value = true;
        showCpf.value = false;
    } catch (error) {
        let errorMessage = 'Erro ao buscar contrato.';

        if (axios.isAxiosError(error) && error.response?.data?.message && error.response.data.code) {
            errorMessage = error.response.data.message;
        }

        console.error('Erro ao buscar contrato:', error);
        contract.value = null;
        showName.value = false;
        showCpf.value = false;
        showContractFields.value = false;

        if (axios.isAxiosError(error) && error.response?.data?.code === 404) {
            notifyWarning(errorMessage);
        } else {
            notifyError(errorMessage);
        }
    }
}

async function onSubmit() {
    validate.value = true;
    loading.value = true;

    if (contract.value && isSameFilters()) {
        if (showName.value && form.value.name) {
            validateByName();
        } else if (showCpf.value && form.value.cpf) {
            validateByCpf();
        }

        await sleep(1000);
        loading.value = false;
        return;
    }

    if (
        form.value.commercialModule &&
        form.value.housingComplexes &&
        form.value.number !== null
    ) {
        await Promise.all([
            fetchContract(),
            sleep(1000)
        ]);
    }

    loading.value = false;
}

async function onSubmitExtract() {
    showAll.value = false;
    loading.value = true;
    await sleep(1500);


    try {
        if (contract.value?.id) {
            const response = await fetchDebtsByContract(contract.value?.id);
            debts.value = Array.isArray(response) ? response : [];
        }
    } catch (error) {
        console.error('Erro ao buscar débitos:', error);
        debts.value = [];
    } finally {
        loading.value = false;
    }
}

function toggleDebtSelection(debt: DebtType) {
    const index = selectedDebts.value.findIndex(d => d.id === debt.id);
    if (index === -1) {
        selectedDebts.value.push(debt);
    } else {
        selectedDebts.value.splice(index, 1);
    }
}

function isDebtSelected(debt: DebtType): boolean {
    return selectedDebts.value.some(d => d.id === debt.id);
}

function sumField(field: keyof DebtType): string {
    const totalCents = debts.value.reduce((acc, debt) => {
        const raw = (debt[field] as string)?.replace(/\./g, '').replace(',', '.');
        const parsed = parseFloat(raw);

        const cents = isNaN(parsed) ? 0 : Math.round(parsed * 100);

        return acc + cents;
    }, 0);

    return formatCurrencyBRL(totalCents / 100);
}

const allSelected = computed(() =>
    debts.value.length > 0 && selectedDebts.value.length === debts.value.length
);

function toggleSelectAll(val: boolean) {
    selectedDebts.value = val ? [...debts.value] : [];
}

function onBack() {
    showAll.value = true;
}

async function onSecondCopy() {
    if (selectedDebts.value.length == 0) {
        notifyWarning("Selecione pelo menos uma parcela!");
        return;
    }

    isSecondCopyLoading.value = true;

    await sleep(1500);

    try {
        const response = await fetchSecondCopyByDebts(selectedDebts.value);

        if (!response) {
            notifyError("Não foi possível gerar a segunda via.");
            isSecondCopyLoading.value = false;
            return;
        }

        const parts = response.split(';');

        const [report, guideId, tipDiscount, installments, arq] = parts.map((p: string) => p.trim());

        if (!report || !guideId || !tipDiscount || !installments || !arq) {
            notifyError("Dados da segunda via incompletos.");
            isSecondCopyLoading.value = false;
            return;
        }

        const birtUrl = import.meta.env.VITE_BIRT_URL;

        const finalUrl = `${birtUrl}${report}&__format=pdf&arq=${arq}&parcelas=${installments}&tipdesconto=${tipDiscount}&codgui=${guideId}`;
        window.open(finalUrl, "_blank");
    } catch (e) {
        notifyError("Erro ao buscar segunda via.");
        console.error(e);
    } finally {
        isSecondCopyLoading.value = false;
    }
}

async function onSlip() {
    isSlipLoading.value = true;

    await sleep(1500);

    try {
        const response = await fetchSlipByDebts(debts.value);

        if (!response) {
            notifyError("Não foi possível gerar o carnê.");
            isSlipLoading.value = false;
            return;
        }

        const parts = response.split(';');

        const [report, arq, guideId] = parts.map((p: string) => p.trim());

        if (!report || !guideId || !arq) {
            notifyError("Dados do carnê incompletos.");
            isSlipLoading.value = false;
            return;
        }

        const birtUrl = import.meta.env.VITE_BIRT_URL;

        const finalUrl = `${birtUrl}${report}&__format=pdf&arq=${arq}&codgui=${guideId}`;
        window.open(finalUrl, "_blank");
    } catch (e) {
        notifyError("Erro ao buscar carnê.");
        console.error(e);
    } finally {
        isSlipLoading.value = false;
    }
}

async function onExtract() {
    isExtractLoading.value = true;

    await sleep(1500);

    try {
        if (contract.value?.id) {
            const response = await fetchExtractByContract(contract.value?.id);

            if (!response) {
                notifyError("Não foi possível gerar o extrato.");
                isExtractLoading.value = false;
                return;
            }

            const parts = response.split(';');

            const [report, contractId, fun, tiprel, ctrfin, ctrini, debtId] = parts.map((p: string) => p.trim());

            if (!report || !contractId || !fun || !ctrfin || !ctrini || !debtId) {
                notifyError("Dados do extrato incompletos.");
                isExtractLoading.value = false;
                return;
            }

            const birtUrl = import.meta.env.VITE_BIRT_URL;

            const finalUrl = `${birtUrl}${report}&__format=pdf&codctr=${contractId}&ctrfin=${ctrfin}&coddeb=${debtId},&ctrini=${ctrini}&tiprel${tiprel}&fun=${fun}`;
            window.open(finalUrl, "_blank");
        }
    } catch (e) {
        notifyError("Erro ao buscar extrato.");
        console.error(e);
    } finally {
        isExtractLoading.value = false;
    }
}

function getContractValue(key: string): string {
    const parts = key.split('.');
    let value: unknown = contract.value;

    for (const part of parts) {
        if (typeof value !== 'object' || value === null) return '';
        value = (value as Record<string, unknown>)[part];
    }

    if (key.toLowerCase().includes('date')) {
        return formatDate(value as Date);
    }

    if (key.toLowerCase().includes('value')) {
        return formatCurrencyBRL(value as number);
    }

    if (typeof value === 'string' && ['S', 'N'].includes(value)) {
        return value === 'S' ? 'Sim' : 'Não';
    }

    return typeof value === 'string' || typeof value === 'number'
        ? String(value)
        : '';
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function useBorrowerAreaPage() {
    return {
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
        allSelected,
        toggleSelectAll,
        selectedDebts
    };
}