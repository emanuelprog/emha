import { api } from 'boot/axios';
import type { PersonFilter } from 'src/types/personType';

export async function fetchBenefited(filter: PersonFilter, page = 0, size = 10) {
    const response = await api.post(`/person/benefiteds?page=${page}&size=${size}`, filter);
    return response.data.obj;
}