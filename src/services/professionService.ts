import { api } from 'boot/axios';

export async function fetchProfessions() {
    const response = await api.get('/profession');

    return response.data.obj;
}