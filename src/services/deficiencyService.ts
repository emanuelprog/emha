import { api } from 'boot/axios';

export async function fetchDeficiencies() {
    const response = await api.get('/deficiency');

    return response.data.obj;
}