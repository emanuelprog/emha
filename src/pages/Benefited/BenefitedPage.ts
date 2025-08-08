import { ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { formatCpfForSearch } from 'src/util/formatUtil';
import type { PersonSummaryType } from 'src/types/personType';
import { fetchBenefited } from 'src/services/personService';

const rows = ref<PersonSummaryType[]>([]);
const loading = ref(false);
const nameFilter = ref('');
const cpfFilter = ref('');

const columns: QTableColumn<PersonSummaryType>[] = [
    { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
    { name: 'formattedCpf', label: 'CPF', field: 'formattedCpf', align: 'left', sortable: true },
    {
        name: 'commercialModule.description',
        label: 'Módulo Comercial',
        field: row => row.commercialModule?.description,
        align: 'left'
    },
    {
        name: 'actions',
        label: 'Conjuntos',
        field: 'id',
        align: 'left',
        sortable: false,
        style: 'width: 150px;'
    },
    { name: 'isBenefited', label: 'Beneficiado', field: 'isBenefited', align: 'left', sortable: true },
    { name: 'status', label: 'Situação', field: 'status', align: 'left', sortable: true }
];

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    sortBy: 'name',
    descending: false,
    rowsNumber: 1
});

async function onRequest(props: { pagination: { page: number; rowsPerPage: number } }) {
    const { page, rowsPerPage } = props.pagination;
    loading.value = true;

    try {
        const response = await fetchBenefited(
            {
                name: nameFilter.value,
                cpf: cpfFilter.value ? formatCpfForSearch(cpfFilter.value) : cpfFilter.value
            },
            page - 1,
            rowsPerPage
        );

        rows.value = response.content;

        const totalElements = response.page?.totalElements ?? response.totalElements ?? 0;

        pagination.value = {
            ...pagination.value,
            page,
            rowsPerPage,
            rowsNumber: totalElements
        };
    } finally {
        loading.value = false;
    }
}

export function useBenefitedPage() {
    return {
        rows,
        columns,
        pagination,
        loading,
        nameFilter,
        cpfFilter,
        onRequest
    };
}
