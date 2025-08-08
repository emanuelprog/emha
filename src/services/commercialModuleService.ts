import { api } from 'boot/axios';

export async function fetchCommercialModules() {
    const response = await api.get('/commercial-module');

    return response.data.obj;
}