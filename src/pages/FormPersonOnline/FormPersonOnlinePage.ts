import type { QTableColumn } from 'quasar';
import { fetchCharts } from 'src/services/chartService';
import { fetchDeficiencies } from 'src/services/deficiencyService';
import { notifyWarning } from 'src/services/messageService';
import { fetchProfessions } from 'src/services/professionService';
import { useEventStore } from 'src/stores/eventStore';
import { usePersonOnlineStore } from 'src/stores/personOnlineStore';
import { createDefaultDependent, type DependentType } from 'src/types/dependentType';
import { createPersonOnlineForm, type PersonOnlineType } from 'src/types/personOnlineType';
import { formatDate } from 'src/util/dateUtil';
import { formatCurrencyBRL } from 'src/util/formatUtil';
import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';

type FieldKind = 'text' | 'number' | 'radio' | 'checkbox' | 'select' | 'date';

interface FieldDef {
    key: string;
    label: string;
    cols: string;
    type: FieldKind;
    mask?: string;
    options?: Array<{ label: string; value: string | number | boolean }> | [];
    condition?: (p: PersonOnlineType | null) => boolean;
    info?: string;
    disable?: boolean;
    required?: boolean | ((p: PersonOnlineType | null) => boolean);
    requiredMessage?: string;
}

interface FieldSection {
    title: string;
    fields: FieldDef[];
}

export function useFormPersonOnlinePage() {

    const personOnlineStore = usePersonOnlineStore();

    const personOnlineFieldSections = ref<FieldSection[]>([
        {
            title: 'Informações Pessoais',
            fields: [
                {
                    key: 'legacySystemCode',
                    label: 'Cadastro Anterior',
                    cols: 'col-12 col-sm-6 col-md-2',
                    type: 'number',
                    disable: true
                },
                {
                    key: 'registrationPassword',
                    label: 'Protocolo',
                    cols: 'col-12 col-sm-6 col-md-10',
                    type: 'number',
                    disable: true
                },
                {
                    key: 'name',
                    label: 'Nome Completo',
                    cols: 'col-12 col-sm-6 col-md-6',
                    type: 'text',
                    disable: true
                },
                {
                    key: 'socialName',
                    label: 'Nome Social',
                    cols: 'col-12 col-sm-6 col-md-6',
                    type: 'text',
                    required: true,
                    requiredMessage: 'Nome Social é obrigatório'
                },
                {
                    key: 'gender',
                    label: 'Sexo',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: [
                        { label: 'Masculino', value: 'M' },
                        { label: 'Feminino', value: 'F' }
                    ]
                },
                {
                    key: 'birthDate',
                    label: 'Data de Nascimento',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'date',
                    mask: '##/##/####',
                    disable: true
                },
                {
                    key: 'maritalStatus.chartDescription',
                    label: 'Estado Civil',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: [],
                    required: (p) => !p?.maritalStatus?.chartDescription?.trim(),
                    requiredMessage: 'Estado Civil é obrigatório'
                },
                {
                    key: 'motherName',
                    label: 'Nome da Mãe',
                    cols: 'col-12 col-sm-6 col-md-12',
                    type: 'text'
                },
                {
                    key: 'fatherName',
                    label: 'Nome do Pai',
                    cols: 'col-12 col-sm-6 col-md-12',
                    type: 'text'
                },
                {
                    key: 'nationality',
                    label: 'Nacionalidade',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'text'
                },
                {
                    key: 'naturalPlace',
                    label: 'Naturalidade',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'text'
                },
                {
                    key: 'professionalStatus.chartDescription',
                    label: 'Situação Profissional',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: []
                },
                {
                    key: 'profession.description',
                    label: 'Profissão',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: []
                },
                {
                    key: 'creditRestrictionFlag',
                    label: 'Possui restrição nos órgãos de proteção ao crédito?',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: [
                        { label: 'Sim', value: 'S' },
                        { label: 'Não', value: 'N' }
                    ]
                },
                {
                    key: 'income',
                    label: 'Renda Familiar',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'text'
                },
                {
                    key: 'email',
                    label: 'E-mail',
                    cols: 'col-12 col-sm-6 col-md-12',
                    type: 'text',
                    disable: true
                }
            ]
        },
        {
            title: 'Informações Complementares do Titular',
            fields: [
                {
                    key: 'isElderly',
                    label: 'É idoso',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-2'
                },
                {
                    key: 'hasChronicDisease',
                    label: 'Tem doença crônica',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-4'
                },
                {
                    key: 'isWheelchair',
                    label: 'Cadeirante',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-2'
                },
                {
                    key: 'hasPhysicalDisability',
                    label: 'Pessoa com deficiência e tem atestado?',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-4'
                },
                {
                    key: 'deficiency.description',
                    label: 'Tipo de Deficiência',
                    cols: 'col-12 col-sm-6 col-md-6',
                    type: 'select',
                    options: []
                },
                {
                    key: 'isBloodDonor',
                    label: 'Doador de Sangue?',
                    cols: 'col-12 col-sm-6 col-md-6',
                    type: 'select',
                    options: [
                        { label: 'Sim', value: 'S' },
                        { label: 'Não', value: 'N' }
                    ]
                },
                {
                    key: 'hasDisablingChronicDisease',
                    label: 'Doença crônica incapacitante para o trabalho e tem atestado?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-6',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    condition: (p) => p?.hasChronicDisease === true
                },
                {
                    key: 'hasDegenerativeDisease',
                    label: 'Doença Crônica degenerativa comprovada com laudo médico?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-6',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    condition: (p) => p?.hasChronicDisease === true
                },
                {
                    key: 'isViolenceVictim',
                    label: 'Mulher vítima de violência',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-4',
                    condition: (p) => p?.gender === 'F'
                },
                {
                    key: 'cras',
                    label: 'Acompanhado pelo CRAS',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'creas',
                    label: 'Acompanhado pelo CREAS',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'hasCancer',
                    label: 'Possui algum tipo de câncer comprovado com laudo médico?',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-6'
                },
                {
                    key: 'isSingleParentFamily',
                    label: 'Família é monoparental?',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-4',
                    info: 'Família composta por um único responsável (pai ou mãe) e seus filhos'
                },
                {
                    key: 'ethnicity',
                    label: 'Etnia',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: [
                        { label: 'BRANCA', value: 'BRANCA' },
                        { label: 'PARDO', value: 'PARDO' },
                        { label: 'AMARELA (ORIENTAIS)', value: 'AMARELA (ORIENTAIS)' },
                        { label: 'NEGRA', value: 'NEGRA' },
                        { label: 'VERMELHA (INDÍGENA)', value: 'VERMELHA (INDÍGENA)' }
                    ]
                },
                {
                    key: 'isQuilombola',
                    label: 'Se for etnia negra a Família é quilombola?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-4',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    condition: (p) => p?.ethnicity?.toUpperCase() === 'NEGRA'
                },
                {
                    key: 'indigenousEthnicity',
                    label: 'Qual etnia indígena?',
                    type: 'select',
                    options: [
                        { label: 'ATIKUN', value: 'ATIKUN' },
                        { label: 'CHAMACOCO', value: 'CHAMACOCO' },
                        { label: 'GUARANY KAIWÁ', value: 'GUARANY KAIWÁ' },
                        { label: 'GUARANY NHANDÉWA', value: 'GUARANY NHANDÉWA' },
                        { label: 'GUATÓ', value: 'GUATÓ' },
                        { label: 'KADIWÉU', value: 'KADIWÉU' },
                        { label: 'KAMBA', value: 'KAMBA' },
                        { label: 'KINIKINAWA', value: 'KINIKINAWA' },
                        { label: 'OFAIÉ', value: 'OFAIÉ' },
                        { label: 'TERENA', value: 'TERENA' },
                        { label: 'XIQUITANO', value: 'XIQUITANO' },
                        { label: 'OUTROS', value: 'OUTROS' }
                    ],
                    cols: 'col-12 col-sm-6 col-md-4',
                    condition: (p) => p?.ethnicity?.toUpperCase() === 'VERMELHA (INDÍGENA)'
                },
                {
                    key: 'livesInVillage',
                    label: 'Mora em aldeia?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-4',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    condition: (p) => p?.ethnicity?.toUpperCase() === 'VERMELHA (INDÍGENA)'
                }
            ]
        },
        {
            title: 'Documentos',
            fields: [
                {
                    key: 'cpf',
                    label: 'CPF',
                    cols: 'col-12 col-md-4',
                    type: 'text',
                    mask: '###.###.###-##',
                    disable: true
                },
                {
                    key: 'rg',
                    label: 'RG/CNH',
                    cols: 'col-12 col-md-4',
                    type: 'text'
                },
                {
                    key: 'rgIssuer',
                    label: 'Órgão Expedidor',
                    cols: 'col-12 col-md-4',
                    type: 'text'
                },
                {
                    key: 'rgState.chartDescription',
                    label: 'UF de Expedição',
                    cols: 'col-12 col-md-4',
                    type: 'select',
                    options: []
                },
                {
                    key: 'rgIssueDate',
                    label: 'Data de Expedição',
                    cols: 'col-12 col-md-4',
                    type: 'text',
                    mask: '##/##/####'
                },
                {
                    key: 'nis',
                    label: 'NIS',
                    cols: 'col-12 col-md-4',
                    type: 'text'
                }
            ]
        },
        {
            title: 'Cônjuge',
            fields: [
                {
                    key: 'spouseName',
                    label: 'Nome Completo',
                    cols: 'col-12 col-md-9',
                    type: 'text'
                },
                {
                    key: 'spouseGender',
                    label: 'Sexo',
                    cols: 'col-12 col-md-3',
                    type: 'select',
                    options: [
                        { label: 'Masculino', value: 'M' },
                        { label: 'Feminino', value: 'F' }
                    ]
                },
                {
                    key: 'spouseBirthDate',
                    label: 'Data de Nascimento',
                    cols: 'col-12 col-md-3',
                    type: 'text',
                    mask: '##/##/####'
                },
                {
                    key: 'spouseNis',
                    label: 'NIS',
                    cols: 'col-12 col-md-3',
                    type: 'text'
                },
                {
                    key: 'spouseCpf',
                    label: 'CPF',
                    cols: 'col-12 col-md-3',
                    type: 'text',
                    mask: '###.###.###-##'
                },
                {
                    key: 'spouseRgNumber',
                    label: 'RG/CNH',
                    cols: 'col-12 col-md-3',
                    type: 'text'
                },
                {
                    key: 'spouseMotherName',
                    label: 'Nome da Mãe',
                    cols: 'col-12 col-md-6',
                    type: 'text'
                },
                {
                    key: 'spouseFatherName',
                    label: 'Nome do Pai',
                    cols: 'col-12 col-md-6',
                    type: 'text'
                },
                {
                    key: 'spouseNationality',
                    label: 'Nacionalidade',
                    cols: 'col-12 col-md-4',
                    type: 'select',
                    options: [
                        { label: 'Brasileira', value: 'B' },
                        { label: 'Estrangeira', value: 'E' }
                    ]
                },
                {
                    key: 'spouseProfessionStatus.chartDescription',
                    label: 'Situação Profissional',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: []
                },
                {
                    key: 'spouseProfession.description',
                    label: 'Profissão',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: []
                },
                {
                    key: 'spouseEthnicity',
                    label: 'Etnia',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: [
                        { label: 'BRANCA', value: 'BRANCA' },
                        { label: 'PARDO', value: 'PARDO' },
                        { label: 'AMARELA (ORIENTAIS)', value: 'AMARELA (ORIENTAIS)' },
                        { label: 'NEGRA', value: 'NEGRA' },
                        { label: 'VERMELHA (INDÍGENA)', value: 'VERMELHA (INDÍGENA)' }
                    ]
                },
                {
                    key: 'spouseIsQuilombola',
                    label: 'Se for etnia negra a Família é quilombola?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-4',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    condition: (p) => p?.spouseEthnicity?.toUpperCase() === 'NEGRA'
                },
                {
                    key: 'spouseIndigenousEthnicity',
                    label: 'Qual etnia indígena?',
                    type: 'select',
                    options: [
                        { label: 'ATIKUN', value: 'ATIKUN' },
                        { label: 'CHAMACOCO', value: 'CHAMACOCO' },
                        { label: 'GUARANY KAIWÁ', value: 'GUARANY KAIWÁ' },
                        { label: 'GUARANY NHANDÉWA', value: 'GUARANY NHANDÉWA' },
                        { label: 'GUATÓ', value: 'GUATÓ' },
                        { label: 'KADIWÉU', value: 'KADIWÉU' },
                        { label: 'KAMBA', value: 'KAMBA' },
                        { label: 'KINIKINAWA', value: 'KINIKINAWA' },
                        { label: 'OFAIÉ', value: 'OFAIÉ' },
                        { label: 'TERENA', value: 'TERENA' },
                        { label: 'XIQUITANO', value: 'XIQUITANO' },
                        { label: 'OUTROS', value: 'OUTROS' }
                    ],
                    cols: 'col-12 col-sm-6 col-md-4',
                    condition: (p) => p?.spouseEthnicity?.toUpperCase() === 'VERMELHA (INDÍGENA)'
                },
                {
                    key: 'spouseLivesInVillage',
                    label: 'Mora em aldeia?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-4',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    condition: (p) => p?.spouseEthnicity?.toUpperCase() === 'VERMELHA (INDÍGENA)'
                },
                {
                    key: 'spouseHasCancer',
                    label: 'Possui algum tipo de câncer comprovado com laudo médico?',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-6'
                },
                {
                    key: 'spouseIsElderly',
                    label: 'É idoso',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-2'
                },
                {
                    key: 'spouseHasChronicDisease',
                    label: 'Tem doença crônica',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-4'
                },
                {
                    key: 'spouseHasDisability',
                    label: 'Pessoa com deficiência e tem atestado?',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-4'
                },
                {
                    key: 'isSpouseDependent',
                    label: 'Dependente do Titular?',
                    type: 'checkbox',
                    cols: 'col-12 col-md-4'
                }
            ]
        },
        {
            title: 'Endereço',
            fields: [
                {
                    key: 'addresses[0].zipCode',
                    label: 'CEP',
                    cols: 'col-12 col-sm-6 col-md-3',
                    type: 'text',
                    mask: '#####-###'
                },
                {
                    key: 'addresses[0].street',
                    label: 'Logradouro',
                    cols: 'col-12 col-sm-6 col-md-6',
                    type: 'text'
                },
                {
                    key: 'addresses[0].number',
                    label: 'Nº',
                    cols: 'col-12 col-sm-6 col-md-3',
                    type: 'text'
                },
                {
                    key: 'addresses[0].complement',
                    label: 'Complemento',
                    cols: 'col-12 col-sm-6 col-md-6',
                    type: 'text'
                },
                {
                    key: 'addresses[0].neighborhood',
                    label: 'Bairro',
                    cols: 'col-12 col-sm-6 col-md-6',
                    type: 'text'
                },
                {
                    key: 'addresses[0].region',
                    label: 'Região',
                    cols: 'col-12 col-sm-6 col-md-6',
                    type: 'text'
                },
                {
                    key: 'addresses[0].city',
                    label: 'Cidade',
                    cols: 'col-12 col-sm-6 col-md-6',
                    type: 'text'
                },
                {
                    key: 'phone',
                    label: 'Telefone Fixo',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'text',
                    mask: '(##) ####-####'
                },
                {
                    key: 'mobile',
                    label: 'Celular',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'text',
                    mask: '(##) #####-####'
                },
                {
                    key: 'contactPhone',
                    label: 'Telefone para Recado',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'text',
                    mask: '(##) #####-####'
                }
            ]
        },
        {
            title: 'Dependentes',
            fields: [
                {
                    key: 'mainDependent.totalDependents',
                    label: 'Número Total de Dependentes',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'number'
                },
                {
                    key: 'mainDependent.under14',
                    label: 'Filhos Menores de 14 Anos',
                    type: 'number',
                    cols: 'col-12 col-sm-6 col-md-4'
                },
                {
                    key: 'mainDependent.over60',
                    label: 'Número de Dependentes Maior de 60 Anos',
                    type: 'number',
                    cols: 'col-12 col-sm-6 col-md-4'
                },
                {
                    key: 'mainDependent.hasWheelchairDependent',
                    label: 'Cadeirante',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'mainDependent.hasMotorDisability',
                    label: 'Motora',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'mainDependent.hasPhysicalDisability',
                    label: 'Física',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'mainDependent.hasHearingDisability',
                    label: 'Auditiva',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'mainDependent.hasVisualDisability',
                    label: 'Visual',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'mainDependent.hasMultipleDisabilities',
                    label: 'Múltipla',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'mainDependent.hasMentalDisability',
                    label: 'Mental',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'mainDependent.hasOtherDisabilities',
                    label: 'Outras',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'mainDependent.hasCancer',
                    label: 'Possui algum tipo de câncer comprovado com laudo médico?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-6',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }]
                },
                {
                    key: 'mainDependent.hasMicrocephaly',
                    label: 'Dependente/Membro Familiar com Microcefalia',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-6',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }]
                },
                {
                    key: 'mainDependent.totalWithDisability',
                    label: 'Número de Dependentes com Deficiência',
                    type: 'number',
                    cols: 'col-12 col-sm-6 col-md-6'
                },
                {
                    key: 'mainDependent.totalChronicDiseases',
                    label: 'Número de Dependentes com Doença Crônica',
                    type: 'number',
                    cols: 'col-12 col-sm-6 col-md-6'
                }
            ]
        },
        {
            title: 'Moradia',
            fields: [
                {
                    key: 'housingType.chartDescription',
                    label: 'Tipo de Imóvel',
                    cols: 'col-12 col-md-6',
                    type: 'select',
                    options: []
                },
                {
                    key: 'housingSituation.chartDescription',
                    label: 'Situação de Moradia',
                    cols: 'col-12 col-md-6',
                    type: 'select',
                    options: []
                },
                {
                    key: 'formattedRentValue',
                    label: 'Valor do Aluguel/Financiamento',
                    cols: 'col-12 col-md-6',
                    type: 'text'
                },
                {
                    key: 'householdResponsibleGender',
                    label: 'Responsável pela Unidade Familiar',
                    cols: 'col-12 col-md-6',
                    type: 'select',
                    options: [{ label: 'Homem', value: 'H' }, { label: 'Mulher', value: 'M' }]
                },
                {
                    key: 'residenceTime',
                    label: 'Tempo de Residência em Campo Grande',
                    cols: 'col-12 col-md-6',
                    type: 'number'
                },
                {
                    key: 'residenceTimeType',
                    label: 'Selecione...',
                    cols: 'col-12 col-md-6',
                    type: 'select',
                    options: [{ label: 'DIAS', value: 'DIAS' }, { label: 'MESES', value: 'MESES' }, { label: 'ANOS', value: 'ANOS' }]
                },
                {
                    key: 'ownsProperty',
                    label: 'Possui Imóvel',
                    type: 'checkbox',
                    cols: 'col-12 col-md-3'
                },
                {
                    key: 'liveOrWork3KmFromTheDevelopment',
                    label: 'Mora ou Trabalha a 3km do Empreendimento',
                    type: 'checkbox',
                    cols: 'col-12 col-md-9'
                },
                {
                    key: 'hasPrecariousHousing',
                    label: 'Vive em habitação precária, caracterizada por domicílio improvisado ou inacabado?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Mora em casa improvisada ou ainda em construção, sem condições adequadas.'
                },
                {
                    key: 'isInCoHousing',
                    label: 'Encontra-se em situação de coabitação, convivendo com outras famílias em um mesmo domicílio?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Divide a mesma casa com outra(s) família(s), morando no mesmo domicílio.'
                },
                {
                    key: 'hasOvercrowding',
                    label: 'Encontra-se em situação de adensamento excessivo em domicílio alugado, superando a média de três pessoas por dormitório?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Mais de três pessoas morando em cada dormitório do imóvel alugado.'
                },
                {
                    key: 'livesInRiskArea',
                    label: 'Residente em área de risco (deslizamento, app, inundações, entre outros)?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Mora em área com risco de deslizamentos, enchentes ou outras ameaças ambientais.'
                },
                {
                    key: 'hasExcessiveRentBurden',
                    label: 'Encontra-se em situação de ônus excessivo com aluguel, despendendo mais de 30% da renda para pagamento?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Compromete mais de 30% da renda mensal apenas com aluguel.'
                },
                {
                    key: 'receivesRentSubsidy',
                    label: 'É beneficiário de programa de aluguel social provisório? (Programa de Locação Social ou Recomeçar Moradia)',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Recebe auxílio de programa público de aluguel, como Locação Social ou Recomeçar Moradia.'
                },
                {
                    key: 'isHomeless',
                    label: 'Encontra-se em situação de Rua?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Indique se você vive atualmente em situação de rua, ou seja, sem residência fixa ou em condições de vulnerabilidade habitacional.'
                }
            ]
        },
        {
            title: 'Empreendimento(s) de Interesse',
            fields: [
                {
                    key: 'wantsApartment',
                    label: 'Apartamento',
                    type: 'checkbox',
                    cols: 'col-12 col-md-2'
                },
                {
                    key: 'wantsHouse',
                    label: 'Casa',
                    type: 'checkbox',
                    cols: 'col-12 col-md-2'
                },
                {
                    key: 'wantsLand',
                    label: 'Terreno',
                    type: 'checkbox',
                    cols: 'col-12 col-md-2'
                }
            ]
        },
        {
            title: 'Programas de Interesse',
            fields: [
                {
                    key: 'wantsLandAndMaterial',
                    label: 'Credihabita',
                    type: 'checkbox',
                    cols: 'col-12 col-md-3'
                },
                {
                    key: 'wantsSubsidizedLoan',
                    label: 'Sonho de Morar (Entrada para financiamento)',
                    type: 'checkbox',
                    cols: 'col-12 col-md-6'
                },
                {
                    key: 'wantsSocialRentFlag',
                    label: 'Locação Social',
                    type: 'checkbox',
                    cols: 'col-12 col-md-3'
                }
            ]
        }
    ]);

    const chronicColumns: QTableColumn[] = [
        { name: 'name', label: 'Nome', field: 'name', align: 'left' },
        { name: 'disease', label: 'Doença', field: 'disease', align: 'left' },
        { name: 'degenerative', label: 'Degenerativa', field: 'degenerative', align: 'left' }
    ];

    const disabilityColumns: QTableColumn[] = [
        { name: 'name', label: 'Nome', field: 'name', align: 'left' },
        { name: 'disease', label: 'Doença', field: 'disease', align: 'left' }
    ];

    const chronicDiseaseRows = computed(() => {
        const deps = (personOnline.value as PersonOnlineType | null)?.dependents ?? [];
        return deps
            .filter(d => d.dependentsWithDisabilitiesNames != null && d.descriptionOfDisabilities != null && d.hasDegenerativeDisease != null)
            .map((d, idx) => ({
                __key: d.id ?? `c-${idx}`,
                name: d.dependentsWithDisabilitiesNames,
                disease: d.descriptionOfDisabilities,
                degenerative: toYesNo(d.hasDegenerativeDisease)
            }));
    });

    const disabilityRows = computed(() => {
        const deps = (personOnline.value as PersonOnlineType | null)?.dependents ?? [];
        return deps
            .filter(d => d.descriptionOfDisabilities != null && d.dependentsWithDisabilitiesNames != null && d.hasDegenerativeDisease == null)
            .map((d, idx) => ({
                __key: d.id ?? `d-${idx}`,
                name: d.dependentsWithDisabilitiesNames,
                disease: d.descriptionOfDisabilities
            }));
    });

    const personOnline = ref<PersonOnlineType>(createPersonOnlineForm());
    const validate = ref(false);
    const router = useRouter();
    const eventStore = useEventStore();

    const isRegister = window.location.hostname.includes("cadastro");

    function toYesNo(v: unknown): string {
        if (typeof v === 'boolean') return v ? 'Sim' : 'Não';
        if (typeof v === 'string') return v.toUpperCase() === 'S' ? 'Sim' : 'Não';
        return 'Não';
    }

    function getPersonOnlineValue(path: string, type?: FieldKind): string | number | boolean | null {
        const src = personOnline.value as unknown;

        if (src == null) {
            if (type === 'number') return null;
            if (type === 'radio' || type === 'checkbox') return false;
            return '';
        }


        if (path.startsWith('mainDependent.')) {
            const { dependents = [] } = (src as { dependents?: DependentType[] });

            const mainDependent = dependents.find(dp => dp.descriptionOfDisabilities == null && dp.dependentsWithDisabilitiesNames == null);

            if (mainDependent) {
                switch (path) {
                    case 'mainDependent.totalDependents':
                        return mainDependent.totalDependents;
                    case 'mainDependent.under14':
                        return mainDependent.under14;
                    case 'mainDependent.over60':
                        return mainDependent.over60;
                    case 'mainDependent.hasWheelchairDependent':
                        return mainDependent.hasWheelchairDependent;
                    case 'mainDependent.hasMotorDisability':
                        return mainDependent.hasMotorDisability;
                    case 'mainDependent.hasPhysicalDisability':
                        return mainDependent.hasPhysicalDisability;
                    case 'mainDependent.hasHearingDisability':
                        return mainDependent.hasHearingDisability;
                    case 'mainDependent.hasVisualDisability':
                        return mainDependent.hasVisualDisability;
                    case 'mainDependent.hasMultipleDisabilities':
                        return mainDependent.hasMultipleDisabilities;
                    case 'mainDependent.hasMentalDisability':
                        return mainDependent.hasMentalDisability;
                    case 'mainDependent.hasOtherDisabilities':
                        return mainDependent.hasOtherDisabilities;
                    case 'mainDependent.totalWithDisability':
                        return mainDependent.totalWithDisability;
                    case 'mainDependent.hasMicrocephaly':
                        return mainDependent.hasMicrocephaly;
                    case 'mainDependent.totalChronicDiseases':
                        return mainDependent.totalChronicDiseases;
                    case 'mainDependent.hasCancer':
                        return mainDependent.hasCancer;
                    default:
                        break;
                }
            }
        }

        const tokens = path
            .replace(/\[(\w+)\]/g, '.$1')
            .replace(/^\./, '')
            .split('.');

        let cur: unknown = src;

        for (const t of tokens) {
            if (cur == null) {
                if (type === 'number') return null;
                if (type === 'radio' || type === 'checkbox') return false;
                return '';
            }

            if (t === 'length' && Array.isArray(cur)) {
                cur = cur.length;
                continue;
            }

            if (/^\d+$/.test(t) && Array.isArray(cur)) {
                cur = cur[Number(t)];
                continue;
            }

            cur = (cur as Record<string, unknown>)[t];
        }

        if (type === 'radio' || type === 'checkbox') {
            return (cur as boolean) ?? false;
        }

        if (type === 'number') {
            return typeof cur === 'number' ? cur : Number(cur) || null;
        }


        if (typeof cur === 'string' && path.toLowerCase().includes('date') && !path.toLowerCase().includes('birthdate')) {
            return formatDate(cur as unknown as Date);
        }
        if (path.toLowerCase().includes('value') || path.toLowerCase().includes('income')) {
            return formatCurrencyBRL(Number(cur));
        }
        if (typeof cur === 'string' && ['S', 'N'].includes(cur)) {
            return cur === 'S' ? 'Sim' : 'Não';
        }
        if (typeof cur === 'string' && ['B', 'E'].includes(cur)) {
            return cur === 'B' ? 'Brasileira' : 'Estrangeiro';
        }
        if (typeof cur === 'string' && ['M', 'F'].includes(cur)) {
            return cur === 'M' ? 'Masculino' : 'Feminino';
        }
        if (typeof cur === 'string' && ['H', 'M'].includes(cur)) {
            return cur === 'H' ? 'Homem' : 'Mulher';
        }

        return typeof cur === 'string' || typeof cur === 'number' ? cur : '';
    }

    function getPersonOnlineString(path: string): string {
        return String(getPersonOnlineValue(path, 'text') ?? '');
    }

    function getPersonOnlineNumber(path: string): number | null {
        const v = getPersonOnlineValue(path, 'number');
        return typeof v === 'number' ? v : Number(v) || null;
    }

    function getPersonOnlineBoolean(path: string): boolean {
        return Boolean(getPersonOnlineValue(path, 'checkbox'));
    }

    function getPersonOnlineSelect(path: string): string | number | null {
        const v = getPersonOnlineValue(path, 'select');

        if (v && typeof v === 'object') {
            if ('value' in (v as Record<string, unknown>)) {
                return (v as Record<string, unknown>).value as string | number;
            }
        }

        if (typeof v === 'string' || typeof v === 'number') {
            return v;
        }

        return null;
    }

    function setPersonOnlineValue<K extends keyof DependentType>(
        path: string,
        value: DependentType[K] | null
    ) {
        if (typeof value === 'string' && value.trim() === '') {
            value = null as DependentType[K];
        }

        if (path.startsWith('mainDependent.')) {
            const field = path.replace('mainDependent.', '') as K;

            let dependent = personOnline.value.dependents?.find(
                dp => dp.descriptionOfDisabilities == null && dp.dependentsWithDisabilitiesNames == null
            );

            if (!dependent) {
                if (!personOnline.value.dependents) {
                    personOnline.value.dependents = [];
                }
                dependent = createDefaultDependent();

                dependent[field] = value as DependentType[K];

                personOnline.value.dependents.push(dependent);
            } else {
                dependent[field] = value as DependentType[K];
            }
        }

        const keys = path.split('.');
        const root = personOnline.value as unknown as Record<string, unknown>;

        keys.slice(0, -1).reduce((acc, key) => {
            if (typeof acc[key] !== 'object' || acc[key] === null) {
                acc[key] = {};
            }
            return acc[key] as Record<string, unknown>;
        }, root)[keys[keys.length - 1]!] = value;

        console.log(personOnline.value);

    }

    function getRaw(path: string): unknown {
        const tokens = path
            .replace(/\[(\w+)\]/g, '.$1')
            .replace(/^\./, '')
            .split('.');

        let cur: unknown = personOnline.value;

        for (const t of tokens) {
            if (cur == null) return null;
            if (t === 'length' && Array.isArray(cur)) return cur.length;
            if (typeof cur === 'object' && cur !== null && t in (cur as Record<string, unknown>)) {
                cur = (cur as Record<string, unknown>)[t];
            } else {
                return null;
            }
        }
        return cur;
    }

    function isEmptyValue(v: unknown, type: FieldKind): boolean {
        if (type === 'number')
            return v === null || v === undefined || (typeof v === 'number' && Number.isNaN(v));

        if (type === 'select')
            return v === null || v === undefined || v === '';

        if (type === 'date')
            return typeof v !== 'string' || v.trim() === '';

        return typeof v !== 'string' || v.trim() === '';
    }

    function isFieldRequired(field: FieldDef): boolean {
        if (typeof field.required === 'function') return field.required(personOnline.value);
        return !!field.required;
    }

    function hasError(field: FieldDef): boolean {
        if (!validate.value) return false;
        if (!isFieldRequired(field)) return false;
        if (!evalCond(field, personOnline.value)) return false;

        const raw = getRaw(field.key);
        return isEmptyValue(raw, field.type);
    }

    function getErrorMessage(field: FieldDef): string {
        return field.requiredMessage || `${field.label} é obrigatório`;
    }

    function loadPersonOnline() {
        if (personOnlineStore.selectedPersonOnline) {
            personOnline.value = personOnlineStore.selectedPersonOnline;
        }
    }

    async function loadSelectOptions() {
        try {
            const [
                maritalStatusRes,
                professionalStatusRes,
                ufRgRes,
                housingSituationsRes,
                housingTypeRes,
                professionRes,
                deficiencyRes
            ] = await Promise.all([
                fetchCharts('ESTCIV'),
                fetchCharts('SITPRO'),
                fetchCharts('UF'),
                fetchCharts('SITIMO'),
                fetchCharts('TIPIMO'),
                fetchProfessions(),
                fetchDeficiencies()
            ]);

            const maritalStatusOptions = toOptions(maritalStatusRes, 'chartDescription');
            const professionalStatusOptions = toOptions(professionalStatusRes, 'chartDescription');
            const ufRgOptions = toOptions(ufRgRes, 'chartDescription');
            const housingSituationOptions = toOptions(housingSituationsRes, 'chartDescription');
            const housingTypeOptions = toOptions(housingTypeRes, 'chartDescription');
            const professionOptions = toOptions(professionRes, 'description');
            const deficiencyOptions = toOptions(deficiencyRes, 'description');

            setFieldOptionsByKey('maritalStatus.chartDescription', maritalStatusOptions);
            setFieldOptionsByKey('professionalStatus.chartDescription', professionalStatusOptions);
            setFieldOptionsByKey('rgState.chartDescription', ufRgOptions);
            setFieldOptionsByKey('housingSituation.chartDescription', housingSituationOptions);
            setFieldOptionsByKey('housingType.chartDescription', housingTypeOptions);
            setFieldOptionsByKey('profession.description', professionOptions);
            setFieldOptionsByKey('deficiency.description', deficiencyOptions);

            setFieldOptionsByKey('spouseProfessionStatus.chartDescription', professionalStatusOptions);
            setFieldOptionsByKey('spouseProfession.description', professionOptions);
        } catch (e) {
            console.error('Erro ao carregar opções:', e);
            notifyWarning('Não foi possível carregar algumas listas. Tente novamente mais tarde.');
        }
    }

    function toOptions<T extends Record<string, unknown>>(
        list: T[],
        labelKey: keyof T,
        valueKey?: keyof T
    ): Array<{ label: string; value: string | number | boolean }> {
        if (!Array.isArray(list)) return [];
        return list
            .filter((it) => it != null)
            .map((it) => {
                const label = String(it[labelKey] ?? '');
                const value = valueKey ? (it[valueKey] as string | number | boolean) : label;
                return { label, value };
            });
    }

    function setFieldOptionsByKey(
        fieldKey: string,
        options: Array<{ label: string; value: string | number | boolean }>
    ) {
        personOnlineFieldSections.value = personOnlineFieldSections.value.map((section) => ({
            ...section,
            fields: section.fields.map((f) =>
                f.key === fieldKey ? { ...f, options } : f
            ),
        }));
    }

    function parseBRL(input: string | number | null | undefined): number {
        if (typeof input === 'number') return input;
        const s = String(input ?? '');
        const digits = s.replace(/[^\d]/g, '');
        if (!digits) return 0;
        return Number(digits) / 100;
    }

    const incomeModel = computed<string>({
        get() {
            const n = Number(personOnline.value?.income ?? 0);
            return n ? formatCurrencyBRL(n) : '';
        },
        set(val: string) {
            personOnline.value.income = parseBRL(val);
        }
    });

    function isEmpty(value: unknown): boolean {
        return value === null || value === undefined || value === '' ||
            (typeof value === 'number' && Number.isNaN(value));
    }

    function validateRequiredFields(): string | null {
        const requiredFields = personOnlineFieldSections.value
            .flatMap(section => section.fields.filter(f => f.required));

        for (const field of requiredFields) {
            const value = getPersonOnlineValue(field.key, field.type);
            if (isEmpty(value)) {
                return field.key;
            }
        }
        return null;
    }

    function scrollToField(key: string) {
        const el = document.querySelector(`[data-key="${key}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).focus();
        }
    }

    async function onSubmit() {
        validate.value = true;
        const firstInvalidKey = validateRequiredFields();

        if (firstInvalidKey) {
            await nextTick(() => scrollToField(firstInvalidKey));
            return;
        }

        console.log('Form válido', personOnline.value);
    }

    async function onBack() {
        eventStore.setSelectedEventComponent(null);
        await router.push(isRegister ? '/valida-formulario-cadastro' : '/valida-formulario-evento');
    }

    function evalCond(field: FieldDef, person: PersonOnlineType | null) {
        return !field.condition || field.condition(person);
    }

    return {
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
        getErrorMessage
    };
}