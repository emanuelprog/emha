import { ref } from 'vue';
import type { QTableColumn } from 'quasar';
import type { PersonOnlineSummary } from 'src/types/personOnlineType';
import { fetchRegistered } from 'src/services/personOnlineService';
import { formatCpfForSearch } from 'src/util/formatUtil';

const rows = ref<PersonOnlineSummary[]>([]);
const loading = ref(false);
const nameFilter = ref('');
const cpfFilter = ref('');

const columns: QTableColumn[] = [
    { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
    { name: 'formattedCpf', label: 'CPF', field: 'formattedCpf', align: 'left', sortable: true },
    { name: 'isElderly', label: 'Idoso', field: 'isElderly', align: 'left', sortable: true },
    { name: 'hasDisability', label: 'PCD', field: 'hasDisability', align: 'left', sortable: true },
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
        const response = await fetchRegistered(
            { name: nameFilter.value, cpf: cpfFilter.value ? formatCpfForSearch(cpfFilter.value) : cpfFilter.value, registrationPassword: '' },
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

export function useRegisteredPage() {
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
