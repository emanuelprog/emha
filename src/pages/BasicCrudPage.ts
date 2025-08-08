import { ref } from 'vue';

interface CrudForm {
    selectOption: string | null;
    text: string;
    date: string | null;
    number: number | null;
}

const form = ref<CrudForm>({
    selectOption: null,
    text: '',
    date: null,
    number: null
});

const items = ref<CrudForm[]>([]);
const validate = ref(false);

const selectOptions = [
    { label: 'Opção 1', value: 'opcao1' },
    { label: 'Opção 2', value: 'opcao2' },
    { label: 'Opção 3', value: 'opcao3' }
];

function clearForm() {
    form.value = {
        selectOption: null,
        text: '',
        date: null,
        number: null
    };
    validate.value = false;
}

function onSubmit() {
    validate.value = true;
    if (form.value.text && form.value.date && form.value.number !== null && form.value.selectOption) {
        items.value.push({ ...form.value });
        clearForm();
    }
}

function selectItem(item: CrudForm) {
    form.value = { ...item };
}

function deleteItem(index: number) {
    items.value.splice(index, 1);
}

function onClear() {
    clearForm();
}

export function useBasicCrudPage() {
    return {
        form,
        items,
        validate,
        selectOptions,
        clearForm,
        onSubmit,
        onClear,
        selectItem,
        deleteItem
    };
}