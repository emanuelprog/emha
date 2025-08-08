import { api } from 'boot/axios';
import type { DebtType } from 'src/types/debtType';

export async function fetchDebtsByContract(contractId: number) {
    const response = await api.get('/debt/contract', {
        params: {
            contractId: contractId
        }
    });

    return response.data.obj;
}

export async function fetchSecondCopyByDebts(debts: DebtType[]) {
    const response = await api.post('/debt/second-copy', debts);

    return response.data.obj;
}

export async function fetchSlipByDebts(debts: DebtType[]) {
    const response = await api.post('/debt/slip', debts);

    return response.data.obj;
}

export async function fetchExtractByContract(contractId: number) {
    const response = await api.get('/debt/extract', {
        params: {
            contractId: contractId
        }
    });

    return response.data.obj;
}