import { api } from 'boot/axios';
import type { PersonOnlineFilter } from 'src/types/personOnlineType';

export async function fetchRegistered(filter: PersonOnlineFilter, page = 0, size = 10) {
    const response = await api.post(`/person-online/registered?page=${page}&size=${size}`, filter);
    return response.data.obj;
}

export async function fetchPersonOnlineByFilters(filter: PersonOnlineFilter) {
    const response = await api.post('/person-online/second-copy', filter);

    return response.data.obj;
}

export async function fetchSpouse(filter: PersonOnlineFilter) {
    const response = await api.post('/person-online/spouse', filter);

    return response.data.obj;
}