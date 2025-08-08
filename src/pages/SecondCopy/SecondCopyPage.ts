import axios from 'axios';
import type { QTableColumn } from 'quasar';
import { fetchInscriptionsByPersonOnline } from 'src/services/inscriptionService';
import { notifyError, notifyWarning } from 'src/services/messageService';
import { fetchPersonOnlineByFilters } from 'src/services/personOnlineService';
import type { InscriptionType } from 'src/types/inscriptionType';
import type { PersonOnlineType } from 'src/types/personOnlineType';
import { formatDate } from 'src/util/dateUtil';
import { formatCpfForSearch, formatCurrencyBRL } from 'src/util/formatUtil';
import { ref } from 'vue';


interface FormModel {
    number: number | null;
    cpf: string;
    nis: string;
}

const initialFilters: FormModel = {
    number: null,
    cpf: '',
    nis: ''
};

const personOnlineFieldSections = ref([
    {
        title: 'Informações Pessoais',
        fields: [
            { key: 'legacySystemCode', label: 'Cadastro Anterior', cols: 'col-12 col-sm-6 col-md-2', type: 'number', mask: '' },
            { key: 'registrationPassword', label: 'Protocolo', cols: 'col-12 col-sm-6 col-md-4', type: 'number', mask: '' },
            { key: 'name', label: 'Nome Completo', cols: 'col-12 col-sm-6 col-md-12', type: 'text', mask: '' },
            { key: 'socialName', label: 'Nome Social', cols: 'col-12 col-sm-6 col-md-12', type: 'text', mask: '' },
            { key: 'gender', label: 'Sexo', cols: 'col-12 col-sm-6 col-md-4', type: 'text', mask: '' },
            { key: 'birthDate', label: 'Data de Nascimento', cols: 'col-12 col-sm-6 col-md-4', type: 'text', mask: '##/##/####' },
            { key: 'maritalStatus.chartDescription', label: 'Estado Civil', cols: 'col-12 col-sm-6 col-md-4', type: 'text', mask: '' },
            { key: 'motherName', label: 'Nome da Mãe', cols: 'col-12 col-sm-6 col-md-12', type: 'text', mask: '' },
            { key: 'fatherName', label: 'Nome do Pai', cols: 'col-12 col-sm-6 col-md-12', type: 'text', mask: '' },
            { key: 'nationality', label: 'Nacionalidade', cols: 'col-12 col-sm-6 col-md-4', type: 'text', mask: '' },
            { key: 'naturalPlace', label: 'Naturalidade', cols: 'col-12 col-sm-6 col-md-4', type: 'text', mask: '' },
            { key: 'professionalStatus.chartDescription', label: 'Situação Profissional', cols: 'col-12 col-sm-6 col-md-4', type: 'text', mask: '' },
            { key: 'profession.description', label: 'Profissão', cols: 'col-12 col-sm-6 col-md-6', type: 'text', mask: '' },
            { key: 'income', label: 'Renda Familiar', cols: 'col-12 col-sm-6 col-md-6', type: 'text', mask: '' }
        ]
    },
    {
        title: 'Informações Complementares do Titular',
        fields: [
            { key: 'isElderly', label: 'É idoso', type: 'checkbox', cols: 'col-12 col-md-3' },
            { key: 'hasChronicDisease', label: 'Tem doença crônica', type: 'checkbox', cols: 'col-12 col-md-3' },
            { key: 'isWheelchair', label: 'Cadeirante', type: 'checkbox', cols: 'col-12 col-md-3' },
            { key: 'hasPhysicalDisability', label: 'É pessoa com deficiência', type: 'checkbox', cols: 'col-12 col-md-3' },
            { key: 'deficiency.description', label: 'Tipo de Deficiência', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'hasDegenerativeDisease', label: 'Doença crônica incapacitante', type: 'checkbox', cols: 'col-12 col-md-6' },
            { key: 'isViolenceVictim', label: 'Mulher vítima de violência', type: 'checkbox', cols: 'col-12 col-md-6', condition: "gender === 'F'" }
        ]
    },
    {
        title: 'Documentos',
        fields: [
            { key: 'cpf', label: 'CPF', cols: 'col-12 col-md-4', type: 'text', mask: '###.###.###-##' },
            { key: 'rg', label: 'RG/CNH', cols: 'col-12 col-md-4', type: 'text', mask: '' },
            { key: 'rgIssuer', label: 'Órgão Expedidor', cols: 'col-12 col-md-4', type: 'text', mask: '' },
            { key: 'rgState.chartDescription', label: 'UF de Expedição', cols: 'col-12 col-md-4', type: 'text', mask: '' },
            { key: 'rgIssueDate', label: 'Data de Expedição', cols: 'col-12 col-md-4', type: 'text', mask: '##/##/####' },
            { key: 'nis', label: 'NIS', cols: 'col-12 col-md-4', type: 'text', mask: '' }
        ]
    },
    {
        title: 'Cônjuge',
        fields: [
            { key: 'spouseName', label: 'Nome Completo', cols: 'col-12 col-md-9', type: 'text', mask: '' },
            { key: 'spouseGender', label: 'Sexo', cols: 'col-12 col-md-3', type: 'text', mask: '' },
            { key: 'spouseBirthDate', label: 'Data de Nascimento', cols: 'col-12 col-md-3', type: 'text', mask: '##/##/####' },
            { key: 'spouseNis', label: 'NIS', cols: 'col-12 col-md-3', type: 'text', mask: '' },
            { key: 'spouseCpf', label: 'CPF', cols: 'col-12 col-md-3', type: 'text', mask: '###.###.###-##' },
            { key: 'spouseRgNumber', label: 'RG/CNH', cols: 'col-12 col-md-3', type: 'text', mask: '' },
            { key: 'spouseMotherName', label: 'Nome da Mãe', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'spouseFatherName', label: 'Nome do Pai', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'spouseNationality', label: 'Nacionalidade', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'isSpouseDependent', label: 'Dependente do Titular?', type: 'checkbox', cols: 'col-12 col-md-6' }
        ]
    },
    {
        title: 'Endereço',
        fields: [
            { key: 'addresses[0].cep', label: 'CEP', cols: 'col-12 col-md-3', type: 'text', mask: '#####-###' },
            { key: 'addresses[0].street', label: 'Logradouro', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'addresses[0].number', label: 'Nº', cols: 'col-12 col-md-3', type: 'text', mask: '' },
            { key: 'addresses[0].complement', label: 'Complemento', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'addresses[0].neighborhood', label: 'Bairro', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'addresses[0].region', label: 'Região', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'addresses[0].city', label: 'Cidade', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'phone', label: 'Telefone Fixo', cols: 'col-12 col-md-4', type: 'text', mask: '(##) ####-####' },
            { key: 'mobile', label: 'Celular', cols: 'col-12 col-md-4', type: 'text', mask: '(##) #####-####' },
            { key: 'contactPhone', label: 'Telefone para Recado', cols: 'col-12 col-md-4', type: 'text', mask: '(##) #####-####' },
            { key: 'email', label: 'E-mail', cols: 'col-12 col-md-12', type: 'text', mask: '' }
        ]
    },
    {
        title: 'Dependentes',
        fields: [
            { key: 'dependents.length', label: 'Número Total de Dependentes', cols: 'col-12 col-md-6', type: 'number', mask: '' },
            { key: 'hasChildrenUnder14', label: 'Filhos Menores de 14 Anos', type: 'checkbox', cols: 'col-12 col-md-6' },
            { key: 'hasEldersAsDependents', label: 'Número de Dependentes Maior de 60 Anos', type: 'checkbox', cols: 'col-12 col-md-6' },
            { key: 'hasDisability', label: 'Número de Dependentes com Deficiência', type: 'checkbox', cols: 'col-12 col-md-6' },
            { key: 'hasDegenerativeDisease', label: 'Número de Dependentes com Doença Crônica', type: 'checkbox', cols: 'col-12 col-md-4' },
            { key: 'dcionl', label: 'Doença crônica incapacitante', type: 'checkbox', cols: 'col-12 col-md-4' },
            { key: 'mpeonl', label: 'Dependente com Microcefalia', type: 'checkbox', cols: 'col-12 col-md-4' }
        ]
    },
    {
        title: 'Moradia',
        fields: [
            { key: 'housingType.chartDescription', label: 'Tipo de Imóvel', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'areaType.chartDescription', label: 'Área de Risco', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'housingSituation.chartDescription', label: 'Situação de Moradia', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'formattedRentValue', label: 'Valor do Aluguel/Financiamento', cols: 'col-12 col-md-6', type: 'text', mask: '###.###,##' },
            { key: 'householdResponsibleGender', label: 'Responsável pela Unidade Familiar', cols: 'col-12 col-md-6', type: 'text', mask: '' },
            { key: 'residenceTime', label: 'Tempo de Residência em Campo Grande', cols: 'col-12 col-md-6', type: 'number', mask: '' },
            { key: 'pimonl', label: 'Possui Imóvel', type: 'checkbox', cols: 'col-12 col-md-6' },
            { key: 'mpeonl', label: 'Mora ou Trabalha a 3km do Empreendimento', type: 'checkbox', cols: 'col-12 col-md-6' }
        ]
    },
    {
        title: 'Empreendimento(s) de Interesse',
        fields: [
            { key: 'wantsApartment', label: 'Apartamento', type: 'checkbox', cols: 'col-12 col-md-2' },
            { key: 'wantsHouse', label: 'Casa', type: 'checkbox', cols: 'col-12 col-md-2' },
            { key: 'wantsLand', label: 'Terreno', type: 'checkbox', cols: 'col-12 col-md-2' }
        ]
    },
    {
        title: 'Programas de Interesse',
        fields: [
            { key: 'wantsLandAndMaterial', label: 'Credihabita', type: 'checkbox', cols: 'col-12 col-md-3' },
            { key: 'wantsSubsidizedLoan', label: 'Sonho de Morar (Entrada para financiamento)', type: 'checkbox', cols: 'col-12 col-md-6' },
            { key: 'wantsSocialRentFlag', label: 'Locação Social', type: 'checkbox', cols: 'col-12 col-md-3' }
        ]
    }
]);


const columns: QTableColumn<InscriptionType>[] = [
    { name: 'eventComponent.description', label: 'Evento', field: row => row.eventComponent?.description, align: 'left', sortable: true },
    { name: 'updatedAt', label: 'Data da Inscrição', field: row => formatDate(row.updatedAt), align: 'left', sortable: true },
    {
        name: 'actions',
        label: 'Imprimir',
        field: 'id',
        align: 'left',
        sortable: false,
        style: 'width: 100px;'
    },
];

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    sortBy: 'eventComponent.description',
    descending: false,
    rowsNumber: 1
});

const inscriptions = ref<InscriptionType[]>([]);

const form = ref<FormModel>({ ...initialFilters });
const validate = ref(false);
const loading = ref(false);
const showAll = ref(true);
const showValidateRegister = ref(false);
const showSelection = ref(false);
const showPersonOnlineFields = ref(false);
const showEvent = ref(false);
const isSecondCopyLoading = ref(false);

const personOnline = ref<PersonOnlineType | null>(null);

function onClear() {
    form.value = { ...initialFilters };
    validate.value = false;
    showPersonOnlineFields.value = false;
    personOnline.value = null;
    showAll.value = true;
    showSelection.value = false;
    showEvent.value = false;
}

function isSameFilters(): boolean | null {
    return (
        personOnline.value &&
        form.value.number === personOnline.value.registrationPassword &&
        form.value.cpf === personOnline.value.cpf
    );
}

async function fetchPersonOnline(): Promise<void> {
    try {
        const res = await fetchPersonOnlineByFilters(
            {
                name: '',
                cpf: form.value.cpf ? formatCpfForSearch(form.value.cpf) : form.value.cpf,
                registrationPassword: ''
            }
        );

        personOnline.value = res;

        if (personOnline.value?.registrationPassword) {
            form.value.number = personOnline.value.registrationPassword;
        }

        showValidateRegister.value = true;
        showAll.value = false;
        showPersonOnlineFields.value = true;

    } catch (error) {
        let errorMessage = 'Erro ao buscar segunda via.';

        if (axios.isAxiosError(error) && error.response?.data?.message && error.response.data.code) {
            errorMessage = error.response.data.message;
        }

        console.error('Erro ao buscar segunda via:', error);
        personOnline.value = null;
        showPersonOnlineFields.value = false;

        if (axios.isAxiosError(error) && error.response?.data?.code === 404) {
            notifyWarning(errorMessage);
        } else {
            notifyError(errorMessage);
        }
    }
}

async function fetchInscriptions(): Promise<void> {
    try {
        if (personOnline.value?.id) {
            const res = await fetchInscriptionsByPersonOnline(personOnline.value?.id);

            inscriptions.value = res;

            showEvent.value = true;
            showSelection.value = false;
        }
    } catch (error) {
        let errorMessage = 'Erro ao buscar inscrições.';

        if (axios.isAxiosError(error) && error.response?.data?.message && error.response.data.code) {
            errorMessage = error.response.data.message;
        }

        console.error('Erro ao buscar inscrições:', error);
        inscriptions.value = [];
        if (axios.isAxiosError(error) && error.response?.data?.code === 404) {
            notifyWarning(errorMessage);
        } else {
            notifyError(errorMessage);
        }
    }
}

async function onSubmit() {
    validate.value = form.value.number === null && !form.value.cpf;

    if (personOnline.value && isSameFilters()) {
        showValidateRegister.value = true;
        showAll.value = false;
        return;
    }

    loading.value = true;
    if (!validate.value) {
        await Promise.all([
            fetchPersonOnline(),
            sleep(1000)
        ]);
    }

    loading.value = false;
}

function onValidate() {
    validate.value = form.value.nis === '';
    if (!validate.value) {
        if (String(form.value.nis) === String(personOnline.value?.nis)) {
            showSelection.value = true;
            showValidateRegister.value = false;
        } else {
            notifyWarning("Nis não corresponde ao do cadastro")
        }
    }
}

async function onSelectInscriptionsEvent() {
    loading.value = true;

    await Promise.all([
        fetchInscriptions(),
        sleep(1000)
    ]);

    loading.value = false;
}

function onSelectRegister() {
    showAll.value = true;
    showPersonOnlineFields.value = true;
    showSelection.value = false;
}

function onBackValidate() {
    validate.value = false;
    loading.value = false;
    form.value.nis = '';
    showAll.value = true;
    showValidateRegister.value = false;
}

function onBackSelection() {
    validate.value = false;
    loading.value = false;
    showAll.value = false;
    showSelection.value = false;
    showValidateRegister.value = true;
}

function onBackEvent() {
    showEvent.value = false;
    showSelection.value = true;
}

function onBackRegister() {
    showAll.value = false;
    showPersonOnlineFields.value = false;
    showSelection.value = true;
}

async function onPrintSecondCopy() {
    isSecondCopyLoading.value = true;

    await sleep(1500);

    isSecondCopyLoading.value = false;

    const birtUrl = import.meta.env.VITE_BIRT_URL;

    const finalUrl = `${birtUrl}emhonlrel.rptdesign&__format=pdf&protocolo=${personOnline.value?.registrationPassword}`;
    window.open(finalUrl, "_blank");
}

function onPrintInscription(id: number) {
    const selected = inscriptions.value.find(item => item.id === id);
    if (!selected) return;

    const birtUrl = import.meta.env.VITE_BIRT_URL;
    const url = `${birtUrl}emhinseverel.rptdesign&__format=pdf&codins=${id}`;

    window.open(url, '_blank');
}

function getPersonOnlineValue(key: string): string {
    const parts = key.split('.');
    let value: unknown = personOnline.value;

    for (const part of parts) {
        if (typeof value !== 'object' || value === null) return '';
        value = (value as Record<string, unknown>)[part];
    }

    if (key.toLowerCase().includes('date')) {
        return formatDate(value as Date);
    }

    if (key.toLowerCase().includes('value') || key.toLowerCase().includes('income')) {
        return formatCurrencyBRL(value as number);
    }

    if (typeof value === 'string' && ['S', 'N'].includes(value)) {
        return value === 'S' ? 'Sim' : 'Não';
    }

    if (typeof value === 'string' && ['B', 'E'].includes(value)) {
        return value === 'B' ? 'Brasileira' : 'Estrangeiro';
    }

    if (typeof value === 'string' && ['M', 'F'].includes(value)) {
        return value === 'M' ? 'Masculino' : 'Feminino';
    }

    return typeof value === 'string' || typeof value === 'number'
        ? String(value)
        : '';
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function useSecondCopyPage() {
    return {
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
    };
}