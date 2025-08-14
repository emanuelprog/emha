import axios from 'axios';
import type { QTableColumn } from 'quasar';
import { fetchAddressByCep } from 'src/services/addressService';
import { fetchCharts } from 'src/services/chartService';
import { fetchDeficiencies } from 'src/services/deficiencyService';
import { createInscription, updateInscription } from 'src/services/inscriptionService';
import { notifyError, notifyWarning } from 'src/services/messageService';
import { createPersonOnline, updatePersonOnline } from 'src/services/personOnlineService';
import { fetchProfessions } from 'src/services/professionService';
import { useEventStore } from 'src/stores/eventStore';
import { useInscriptionStore } from 'src/stores/inscriptionStore';
import { usePersonOnlineStore } from 'src/stores/personOnlineStore';
import { createDefaultDependent, type DependentType } from 'src/types/dependentType';
import type { InscriptionType } from 'src/types/inscriptionType';
import { createPersonOnlineForm, type PersonOnlineType } from 'src/types/personOnlineType';
import { formatDate, toBRDate } from 'src/util/dateUtil';
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
                    disable: true,
                    required: true,
                    requiredMessage: 'Nome Completo é obrigatório'
                },
                {
                    key: 'socialName',
                    label: 'Nome Social',
                    cols: 'col-12 col-sm-6 col-md-6',
                    type: 'text'
                },
                {
                    key: 'gender',
                    label: 'Sexo',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: [
                        { label: 'Masculino', value: 'M' },
                        { label: 'Feminino', value: 'F' }
                    ],
                    required: true,
                    requiredMessage: 'Sexo é obrigatório'
                },
                {
                    key: 'birthDate',
                    label: 'Data de Nascimento',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'date',
                    mask: '##/##/####',
                    disable: true,
                    required: true,
                    requiredMessage: 'Data de Nascimento é obrigatório'
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
                    type: 'text',
                    required: true,
                    requiredMessage: 'Nome da Mãe é obrigatório'
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
                    type: 'text',
                    required: true,
                    requiredMessage: 'Nacionalidade é obrigatório'
                },
                {
                    key: 'naturalPlace',
                    label: 'Naturalidade',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'text',
                    required: true,
                    requiredMessage: 'Naturalidade é obrigatório'
                },
                {
                    key: 'professionalStatus.chartDescription',
                    label: 'Situação Profissional',
                    cols: 'col-12 col-sm-6 col-md-4',
                    type: 'select',
                    options: [],
                    required: (p) => !p?.professionalStatus?.chartDescription?.trim(),
                    requiredMessage: 'Situação Profissional é obrigatório'
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
                    type: 'text',
                    required: true,
                    requiredMessage: 'Renda Familiar é obrigatório'
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
                    condition: (p) => p?.hasChronicDisease === true,
                    required: (p) => p?.hasChronicDisease === true,
                    requiredMessage: 'Doença crônica incapacitante para o trabalho e tem atestado é obrigatório'
                },
                {
                    key: 'hasDegenerativeDisease',
                    label: 'Doença crônica degenerativa comprovada com laudo médico?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-6',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    condition: (p) => p?.hasChronicDisease === true,
                    required: (p) => p?.hasChronicDisease === true,
                    requiredMessage: 'Doença crônica degenerativa comprovada com laudo médico é obrigatório'
                },
                {
                    key: 'isViolenceVictim',
                    label: 'Mulher vítima de violência',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-4',
                    condition: (p) => p?.gender === 'F',
                    required: (p) => p?.gender === 'F',
                    requiredMessage: 'Mulher vítima de violência é obrigatório'
                },
                {
                    key: 'cras',
                    label: 'Acompanhado pelo CRAS',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-3',
                    required: true,
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    requiredMessage: 'Acompanhado pelo CRAS é obrigatório'
                },
                {
                    key: 'creas',
                    label: 'Acompanhado pelo CREAS',
                    type: 'radio',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    cols: 'col-12 col-sm-6 col-md-3',
                    required: true,
                    requiredMessage: 'Acompanhado pelo CREAS é obrigatório'
                },
                {
                    key: 'hasCancer',
                    label: 'Possui algum tipo de câncer comprovado com laudo médico?',
                    type: 'radio',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    cols: 'col-12 col-sm-6 col-md-6',
                    required: true,
                    requiredMessage: 'Possui algum tipo de câncer comprovado com laudo médico é obrigatório'
                },
                {
                    key: 'isSingleParentFamily',
                    label: 'Família é monoparental?',
                    type: 'radio',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    cols: 'col-12 col-sm-6 col-md-4',
                    info: 'Família composta por um único responsável (pai ou mãe) e seus filhos',
                    required: true,
                    requiredMessage: 'Família é monoparental é obrigatório'
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
                    ],
                    required: true,
                    requiredMessage: 'Etnia é obrigatório'
                },
                {
                    key: 'isQuilombola',
                    label: 'Se for etnia negra a família é quilombola?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-4',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    condition: (p) => p?.ethnicity?.toUpperCase() === 'NEGRA',
                    required: (p) => p?.ethnicity?.toUpperCase() === 'NEGRA',
                    requiredMessage: 'Se for etnia negra a família é quilombola é obrigatório'
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
                    condition: (p) => p?.ethnicity?.toUpperCase() === 'VERMELHA (INDÍGENA)',
                    required: (p) => p?.ethnicity?.toUpperCase() === 'VERMELHA (INDÍGENA)',
                    requiredMessage: 'Qual etnia indígena é obrigatório'
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
                    condition: (p) => p?.ethnicity?.toUpperCase() === 'VERMELHA (INDÍGENA)',
                    required: (p) => p?.ethnicity?.toUpperCase() === 'VERMELHA (INDÍGENA)',
                    requiredMessage: 'Mora em aldeia é obrigatório'
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
                    disable: true,
                    required: true,
                    requiredMessage: 'CPF é obrigatório'
                },
                {
                    key: 'rg',
                    label: 'RG/CNH',
                    cols: 'col-12 col-md-4',
                    type: 'text',
                    required: true,
                    requiredMessage: 'RG/CNH é obrigatório'
                },
                {
                    key: 'rgIssuer',
                    label: 'Órgão Expedidor',
                    cols: 'col-12 col-md-4',
                    type: 'text',
                    required: true,
                    requiredMessage: 'Órgão Expedidor é obrigatório'
                },
                {
                    key: 'rgState.chartDescription',
                    label: 'UF de Expedição',
                    cols: 'col-12 col-md-4',
                    type: 'select',
                    options: [],
                    required: (p) => !p?.rgState?.chartDescription?.trim(),
                    requiredMessage: 'UF de Expedição é obrigatório'
                },
                {
                    key: 'rgIssueDate',
                    label: 'Data de Expedição',
                    cols: 'col-12 col-md-4',
                    type: 'text',
                    mask: '##/##/####',
                    required: true,
                    requiredMessage: 'Data de Expedição é obrigatório'
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
                    type: 'radio',
                    options: [
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                    ],
                    cols: 'col-12 col-sm-6 col-md-6'
                },
                {
                    key: 'spouseIsElderly',
                    label: 'É idoso',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
                },
                {
                    key: 'spouseHasChronicDisease',
                    label: 'Tem doença crônica',
                    type: 'checkbox',
                    cols: 'col-12 col-sm-6 col-md-3'
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
                    cols: 'col-12 col-md-3'
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
                    mask: '#####-###',
                    required: true,
                    requiredMessage: 'CEP é obrigatório'
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
                    type: 'text',
                    required: true,
                    requiredMessage: 'Nº é obrigatório'
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
                    type: 'text',
                    required: true,
                    requiredMessage: 'Bairro é obrigatório'
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
                    mask: '(##) #####-####',
                    required: true,
                    requiredMessage: 'Celular é obrigatório'
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
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    required: true,
                    requiredMessage: 'Possui algum tipo de câncer comprovado com laudo médico é obrigatório'
                },
                {
                    key: 'mainDependent.hasMicrocephaly',
                    label: 'Dependente/Membro Familiar com Microcefalia',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-6',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    required: true,
                    requiredMessage: 'Dependente/Membro Familiar com Microcefalia é obrigatório'
                },
                {
                    key: 'mainDependent.totalChronicDiseases',
                    label: 'Número de Dependentes com Doença Crônica',
                    type: 'number',
                    cols: 'col-12 col-sm-6 col-md-6'
                },
                {
                    key: 'mainDependent.totalWithDisability',
                    label: 'Número de Dependentes com Deficiência',
                    type: 'number',
                    cols: 'col-12 col-sm-6 col-md-6'
                },
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
                    options: [],
                    required: (p) => !p?.housingType?.chartDescription?.trim(),
                    requiredMessage: 'Tipo de Imóvel é obrigatório'
                },
                {
                    key: 'housingSituation.chartDescription',
                    label: 'Situação de Moradia',
                    cols: 'col-12 col-md-6',
                    type: 'select',
                    options: [],
                    required: (p) => !p?.housingSituation?.chartDescription?.trim(),
                    requiredMessage: 'Situação de Moradia é obrigatório'
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
                    options: [{ label: 'Homem', value: 'H' }, { label: 'Mulher', value: 'M' }],
                    required: true,
                    requiredMessage: 'Responsável pela Unidade Familiar é obrigatório'
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
                    type: 'radio',
                    cols: 'col-12 col-md-3',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    required: true,
                    requiredMessage: 'Possui Imóvel é obrigatório'
                },
                {
                    key: 'liveOrWork3KmFromTheDevelopment',
                    label: 'Mora ou Trabalha a 3km do Empreendimento',
                    type: 'radio',
                    cols: 'col-12 col-md-9',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    required: true,
                    requiredMessage: 'Mora ou Trabalha a 3km do Empreendimento é obrigatório'
                },
                {
                    key: 'hasPrecariousHousing',
                    label: 'Vive em habitação precária, caracterizada por domicílio improvisado ou inacabado?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Mora em casa improvisada ou ainda em construção, sem condições adequadas.',
                    required: true,
                    requiredMessage: 'Vive em habitação precária, caracterizada por domicílio improvisado ou inacabado é obrigatório'
                },
                {
                    key: 'isInCoHousing',
                    label: 'Encontra-se em situação de coabitação, convivendo com outras famílias em um mesmo domicílio?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Divide a mesma casa com outra(s) família(s), morando no mesmo domicílio.',
                    required: true,
                    requiredMessage: 'Encontra-se em situação de coabitação, convivendo com outras famílias em um mesmo domicílio é obrigatório'
                },
                {
                    key: 'hasOvercrowding',
                    label: 'Encontra-se em situação de adensamento excessivo em domicílio alugado, superando a média de três pessoas por dormitório?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Mais de três pessoas morando em cada dormitório do imóvel alugado.',
                    required: true,
                    requiredMessage: 'Encontra-se em situação de adensamento excessivo em domicílio alugado, superando a média de três pessoas por dormitório é obrigatório'
                },
                {
                    key: 'livesInRiskArea',
                    label: 'Residente em área de risco (deslizamento, app, inundações, entre outros)?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Mora em área com risco de deslizamentos, enchentes ou outras ameaças ambientais.',
                    required: true,
                    requiredMessage: 'Residente em área de risco (deslizamento, app, inundações, entre outros) é obrigatório'
                },
                {
                    key: 'hasExcessiveRentBurden',
                    label: 'Encontra-se em situação de ônus excessivo com aluguel, despendendo mais de 30% da renda para pagamento?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Compromete mais de 30% da renda mensal apenas com aluguel.',
                    required: true,
                    requiredMessage: 'Encontra-se em situação de ônus excessivo com aluguel, despendendo mais de 30% da renda para pagamento é obrigatório'
                },
                {
                    key: 'receivesRentSubsidy',
                    label: 'É beneficiário de programa de aluguel social provisório? (Programa de Locação Social ou Recomeçar Moradia)',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Recebe auxílio de programa público de aluguel, como Locação Social ou Recomeçar Moradia.',
                    required: true,
                    requiredMessage: 'É beneficiário de programa de aluguel social provisório? (Programa de Locação Social ou Recomeçar Moradia) é obrigatório'
                },
                {
                    key: 'isHomeless',
                    label: 'Encontra-se em situação de Rua?',
                    type: 'radio',
                    cols: 'col-12 col-sm-6 col-md-12',
                    options: [{ label: 'Sim', value: true }, { label: 'Não', value: false }],
                    info: 'Indique se você vive atualmente em situação de rua, ou seja, sem residência fixa ou em condições de vulnerabilidade habitacional.',
                    required: true,
                    requiredMessage: 'Encontra-se em situação de Rua é obrigatório'
                }
            ]
        },
        {
            title: 'Empreendimento(s) de Interesse (máximo 2 tipos)',
            fields: [
                {
                    key: 'wantsApartment',
                    label: 'Apartamento',
                    type: 'checkbox',
                    cols: 'col-12 col-md-2',
                    condition: (p) => {
                        const total = [
                            p?.wantsApartment,
                            p?.wantsHouse,
                            p?.wantsLand
                        ].filter(Boolean).length;
                        return total < 2 || p?.wantsApartment === true;
                    }
                },
                {
                    key: 'wantsHouse',
                    label: 'Casa',
                    type: 'checkbox',
                    cols: 'col-12 col-md-2',
                    condition: (p) => {
                        const total = [
                            p?.wantsApartment,
                            p?.wantsHouse,
                            p?.wantsLand
                        ].filter(Boolean).length;
                        return total < 2 || p?.wantsHouse === true;
                    }
                },
                {
                    key: 'wantsLand',
                    label: 'Terreno',
                    type: 'checkbox',
                    cols: 'col-12 col-md-2',
                    condition: (p) => {
                        const total = [
                            p?.wantsApartment,
                            p?.wantsHouse,
                            p?.wantsLand
                        ].filter(Boolean).length;
                        return total < 2 || p?.wantsLand === true;
                    }
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
    const validateDependent = ref(false);
    const router = useRouter();
    const eventStore = useEventStore();
    const loadingInscribe = ref(false);

    const isRegister = window.location.pathname.includes("cadastro");

    const mainDependent = computed(() =>
        findMainDependent({ dependents: personOnline.value.dependents })
    );

    const showDependentDialog = ref(false);
    const dependentType = ref<'chronic' | 'disability'>('chronic');

    const dependentForm = ref<Partial<DependentType>>({
        dependentsWithDisabilitiesNames: null,
        descriptionOfDisabilities: null,
        hasDegenerativeDisease: null
    });

    async function onCepBlur(cep: string) {
        if (!cep || cep.length < 8) return;

        try {
            const address = await fetchAddressByCep(cep);

            if (!personOnline.value.addresses) {
                personOnline.value.addresses = [];
            }

            let targetAddress = personOnline.value.addresses[0];

            if (!targetAddress) {
                targetAddress = {
                    id: 0,
                    zipCode: cep,
                    street: '',
                    city: '',
                    region: '',
                    neighborhood: '',
                    number: '',
                    complement: ''
                };
                personOnline.value.addresses.push(targetAddress);
            }

            if (address) {
                targetAddress.street = address.street;
                targetAddress.neighborhood = address.neighborhood;
                targetAddress.city = address.city;
                targetAddress.region = address.state;
                targetAddress.zipCode = cep;
            } else {
                targetAddress.zipCode = cep;
            }

        } catch (error) {
            let errorMessage = 'Erro ao buscar endereço.';

            if (axios.isAxiosError(error) && error.response?.data?.message && error.response.data.code) {
                errorMessage = error.response.data.message;
            }

            if (axios.isAxiosError(error) && error.response?.data?.code === 404) {
                notifyWarning(errorMessage);
            } else {
                notifyError(errorMessage);
            }
        }
    }

    function openDependentDialog(type: 'chronic' | 'disability') {
        dependentType.value = type;
        dependentForm.value = {
            dependentsWithDisabilitiesNames: null,
            descriptionOfDisabilities: null,
            hasDegenerativeDisease: null
        };
        showDependentDialog.value = true;
    }

    function saveDependent() {
        if (!personOnline.value) return;

        if (!personOnline.value.dependents) {
            personOnline.value.dependents = [];
        }

        if (!mainDependent.value) return;

        validateDependent.value = true;

        if (
            !dependentForm.value.dependentsWithDisabilitiesNames ||
            !dependentForm.value.descriptionOfDisabilities ||
            (dependentType.value === 'chronic' &&
                dependentForm.value.hasDegenerativeDisease == null)
        ) {
            return;
        }

        if (dependentType.value === 'chronic') {
            const chronicCount = personOnline.value.dependents.filter(
                d => d.dependentsWithDisabilitiesNames && d.descriptionOfDisabilities && d.hasDegenerativeDisease != null
            ).length;
            if (mainDependent.value.totalChronicDiseases != null && chronicCount >= mainDependent.value.totalChronicDiseases) {
                notifyWarning('Limite de doenças crônicas atingido');
                return;
            }
        }

        if (dependentType.value === 'disability') {
            const disabilityCount = personOnline.value.dependents.filter(
                d => d.dependentsWithDisabilitiesNames && d.descriptionOfDisabilities && d.hasDegenerativeDisease == null
            ).length;
            if (mainDependent.value.totalWithDisability != null && disabilityCount >= mainDependent.value.totalWithDisability) {
                notifyWarning('Limite de deficiências atingido');
                return;
            }
        }
        const newDep: DependentType = {
            id: null,
            totalDependents: null,
            under14: null,
            over60: null,
            totalWithDisability: null,
            hasWheelchairDependent: null,
            hasMotorDisability: null,
            hasPhysicalDisability: null,
            hasHearingDisability: null,
            hasVisualDisability: null,
            hasMultipleDisabilities: null,
            hasOtherDisabilities: null,
            descriptionOfDisabilities: dependentForm.value.descriptionOfDisabilities ?? null,
            dependentsWithDisabilitiesNames: dependentForm.value.dependentsWithDisabilitiesNames ?? null,
            totalChronicDiseases: null,
            hasMentalDisability: null,
            hasMicrocephaly: null,
            hasDisablingChronicDisease: null,
            hasCancer: null,
            hasDegenerativeDisease: dependentType.value === 'chronic'
                ? dependentForm.value.hasDegenerativeDisease ?? null
                : null
        };

        personOnline.value.dependents.push(newDep);
        validateDependent.value = false;
        showDependentDialog.value = false;
    }

    function validateDependentsCount(): boolean {
        const dependent = findMainDependent({ dependents: personOnline.value.dependents ?? [] });
        if (!dependent) return true;

        if (personOnline.value.dependents && dependent.totalChronicDiseases && dependent.totalChronicDiseases > 0) {
            const chronicDeps = personOnline.value.dependents.filter(
                d => d.descriptionOfDisabilities != null &&
                    d.dependentsWithDisabilitiesNames != null &&
                    d.hasDegenerativeDisease != null
            );
            if (chronicDeps.length !== dependent.totalChronicDiseases) {
                notifyWarning(`Você informou ${dependent.totalChronicDiseases} dependente(s) com doença crônica, mas cadastrou ${chronicDeps.length}.`);
                return false;
            }
        }

        if (personOnline.value.dependents && dependent.totalWithDisability && dependent.totalWithDisability > 0) {
            const disabilityDeps = personOnline.value.dependents.filter(
                d => d.descriptionOfDisabilities != null &&
                    d.dependentsWithDisabilitiesNames != null &&
                    d.hasDegenerativeDisease == null
            );
            if (disabilityDeps.length !== dependent.totalWithDisability) {
                notifyWarning(`Você informou ${dependent.totalWithDisability} dependente(s) com deficiência, mas cadastrou ${disabilityDeps.length}.`);
                return false;
            }
        }

        return true;
    }

    function toYesNo(v: unknown): string {
        if (typeof v === 'boolean') return v ? 'Sim' : 'Não';
        if (typeof v === 'string') return v.toUpperCase() === 'S' ? 'Sim' : 'Não';
        return 'Não';
    }

    function getPersonOnlineValue(path: string, type?: FieldKind): string | number | boolean | null {
        const src = personOnline.value as unknown;

        if (src == null) {
            if (type === 'number') return null;
            if (type === 'radio') return null;
            if (type === 'checkbox') return false;
            return '';
        }

        const value = getMainDependentValue(src, path);

        if (value !== undefined) {
            return value;
        }

        const tokens = path
            .replace(/\[(\w+)\]/g, '.$1')
            .replace(/^\./, '')
            .split('.');

        let cur: unknown = src;

        for (const t of tokens) {
            if (cur == null) {
                if (type === 'number') return null;
                if (type === 'radio') return null;
                if (type === 'checkbox') return false;
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
            if (cur === true || cur === 'true' || cur === 1) return true;
            if (cur === false || cur === 'false' || cur === 0) return false;
            return null;
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

    function getMainDependentValue(
        src: { dependents?: DependentType[] },
        path: string
    ) {
        if (!path.startsWith("mainDependent.")) return undefined;

        const mainDependent = findMainDependent(src);

        if (!mainDependent) return undefined;

        const field = path.replace("mainDependent.", "") as keyof DependentType;

        return mainDependent[field];
    }

    function findMainDependent(
        src: { dependents?: (DependentType | null)[] | null }
    ): DependentType | undefined {
        const list = (src.dependents ?? []).filter(Boolean) as DependentType[];
        return list.find(
            dp =>
                dp.descriptionOfDisabilities == null &&
                dp.dependentsWithDisabilitiesNames == null
        );
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

            let dependent = findMainDependent({ dependents: personOnline.value.dependents ?? [] });

            if (!dependent) {
                if (!personOnline.value.dependents) {
                    personOnline.value.dependents = [];
                }
                dependent = createDefaultDependent();
                personOnline.value.dependents.push(dependent);
            }

            const currentValue = dependent[field] as number | null;

            if (
                (field === 'totalWithDisability' || field === 'totalChronicDiseases') &&
                typeof value === 'number' &&
                value !== null
            ) {
                if (currentValue != null && value < currentValue) {
                    const toRemove = currentValue - value;

                    if (field === 'totalWithDisability') {
                        removeDependentsFromList('disability', toRemove);
                    } else if (field === 'totalChronicDiseases') {
                        removeDependentsFromList('chronic', toRemove);
                    }
                }
            }

            dependent[field] = value as DependentType[K];
            return;
        }

        const keys = path.split('.');
        const root = personOnline.value as unknown as Record<string, unknown>;

        keys.slice(0, -1).reduce((acc, key) => {
            if (typeof acc[key] !== 'object' || acc[key] === null) {
                acc[key] = {};
            }
            return acc[key] as Record<string, unknown>;
        }, root)[keys[keys.length - 1]!] = value;
    }

    function removeDependentsFromList(listType: 'disability' | 'chronic', count: number) {
        if (!personOnline.value.dependents || count <= 0) return;

        if (listType === 'disability') {
            const disabilityDeps = personOnline.value.dependents.filter(
                d =>
                    d.dependentsWithDisabilitiesNames &&
                    d.descriptionOfDisabilities &&
                    (d.hasDegenerativeDisease === null || d.hasDegenerativeDisease === undefined)
            );

            disabilityDeps
                .slice()
                .reverse()
                .slice(0, count)
                .forEach(dep => {
                    const idx = personOnline.value.dependents!.indexOf(dep);
                    if (idx > -1) personOnline.value.dependents!.splice(idx, 1);
                });
        }

        if (listType === 'chronic') {
            const chronicDeps = personOnline.value.dependents.filter(
                d =>
                    d.dependentsWithDisabilitiesNames &&
                    d.descriptionOfDisabilities &&
                    d.hasDegenerativeDisease !== null &&
                    d.hasDegenerativeDisease !== undefined
            );

            chronicDeps
                .slice()
                .reverse()
                .slice(0, count)
                .forEach(dep => {
                    const idx = personOnline.value.dependents!.indexOf(dep);
                    if (idx > -1) personOnline.value.dependents!.splice(idx, 1);
                });
        }
    }

    function getRaw(path: string): unknown {
        if (path.startsWith('mainDependent.')) {
            const main = findMainDependent({ dependents: personOnline.value?.dependents ?? [] });
            if (!main) return null;

            const subPath = path.slice('mainDependent.'.length);
            return getByPath(main, subPath);
        }

        return getByPath(personOnline.value, path);
    }

    function getByPath(root: unknown, path: string): unknown {
        const tokens = path
            .replace(/\[(\w+)\]/g, '.$1')
            .replace(/^\./, '')
            .split('.');

        let cur: unknown = root;

        for (const t of tokens) {
            if (cur == null) return null;

            if (t === 'length' && Array.isArray(cur)) {
                return cur.length;
            }

            if (/^\d+$/.test(t) && Array.isArray(cur)) {
                cur = cur[Number(t)];
                continue;
            }

            if (typeof cur === 'object' && cur !== null && t in (cur as Record<string, unknown>)) {
                cur = (cur as Record<string, unknown>)[t];
            } else {
                return null;
            }
        }
        return cur;
    }

    function isEmptyValue(v: unknown, type: FieldKind): boolean {
        switch (type) {
            case 'number':
                return v === null || v === undefined || (typeof v === 'number' && Number.isNaN(v));
            case 'select':
                return v === null || v === undefined || v === '';
            case 'date':
                return typeof v !== 'string' || v.trim() === '';
            case 'radio':
            case 'checkbox':
                return v === null || v === undefined;
            default:
                return typeof v !== 'string' || v.trim() === '';
        }
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

    function validateRequiredFields(): string | null {
        const requiredVisibleFields = personOnlineFieldSections.value
            .flatMap(section =>
                section.fields.filter(f =>
                    evalCond(f, personOnline.value) &&
                    isFieldRequired(f) &&
                    !f.disable
                )
            );

        for (const field of requiredVisibleFields) {
            const value = getPersonOnlineValue(field.key, field.type);
            if (isEmptyValue(value, field.type)) {
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

        if (!validateDependentsCount()) return;

        await Promise.all([
            proccess(),
            sleep(1000)
        ]);

        loadingInscribe.value = false;
    }

    async function proccess(): Promise<void> {
        loadingInscribe.value = true;
        const inscriptionStore = useInscriptionStore();

        try {

            normalizePersonFields(personOnline.value);
            cleanupBadKeys(personOnline.value as unknown as Record<string, unknown>);

            if (!isRegister) {
                const newInscription: InscriptionType = {
                    id: inscriptionStore.selectedInscription?.id ?? null,
                    personOnline: personOnline.value,
                    eventComponent: eventStore.selectedEventComponent,
                    registrationProtocol: '',
                    changeUser: personOnline.value.name,
                    active: true,
                    updatedAt: new Date()
                };

                if (!newInscription.id) {
                    const created = await createInscription(newInscription);
                    inscriptionStore.setSelectedInscription(created);
                } else {
                    const updated = await updateInscription(newInscription);
                    inscriptionStore.setSelectedInscription(updated);
                }
            } else {
                if (!personOnline.value.id) {
                    const created = await createPersonOnline(personOnline.value);
                    personOnlineStore.setSelectedPersonOnline(created);
                } else {
                    const updated = await updatePersonOnline(personOnline.value);
                    personOnlineStore.setSelectedPersonOnline(updated);
                }
            }

            await router.push(isRegister ? '/cadastro-concluido' : '/inscricao-concluida');

        } catch (error) {
            let errorMessage = 'Erro ao processar.';

            if (axios.isAxiosError(error) && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            console.error('Erro ao processar:', error);
            notifyError(errorMessage);
        } finally {
            loadingInscribe.value = false;
        }
    }

    async function onBack() {
        eventStore.setSelectedEventComponent(null);
        await router.push(isRegister ? '/valida-formulario-cadastro' : '/valida-formulario-evento');
    }

    function evalCond(field: FieldDef, person: PersonOnlineType | null) {
        return !field.condition || field.condition(person);
    }

    function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function removeNonDigits(value: string | null | undefined): string {
        if (!value) return '';
        return value.replace(/\D+/g, '');
    }

    function normalizePersonFields(p: PersonOnlineType) {
        p.birthDate = toBRDate(p.birthDate);
        p.rgIssueDate = toBRDate(p.rgIssueDate);
        p.spouseBirthDate = toBRDate(p.spouseBirthDate);

        p.cpf = removeNonDigits(p.cpf);
        p.nis = removeNonDigits(p.nis);
        p.rg = removeNonDigits(p.rg);
        p.spouseCpf = removeNonDigits(p.spouseCpf);

        if (p.phone) {
            p.phone = removeNonDigits(p.phone);
        }
        if (p.mobile) {
            p.mobile = removeNonDigits(p.mobile);
        }

        if (Array.isArray(p.addresses) && p.addresses.length > 0) {
            p.addresses[0]!.zipCode = removeNonDigits(p.addresses[0]!.zipCode);
        }
    }

    function cleanupBadKeys(p: Record<string, unknown>) {
        if ('addresses[0]' in p) {
            delete p['addresses[0]'];
        }
    }

    return {
        loadingInscribe,
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
        saveDependent,
        validateDependent,
        onCepBlur,
        isFieldRequired
    };
}