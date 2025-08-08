export function formatCurrencyBRL(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';

    const stringValue = typeof value === 'string' ? value.replace(',', '.') : value;
    const num = typeof stringValue === 'string' ? parseFloat(stringValue) : stringValue;

    if (isNaN(num)) return '';

    return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export function formatCpfForSearch(cpf: string): string {
    return cpf.replace(/[^\d]/g, '');
}