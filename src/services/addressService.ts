import { api } from 'boot/axios';

export async function fetchAddressByCep(cep: string) {
    const response = await api.get('/address/cep', {
        params: {
            cep: cep
        }
    });

    return response.data.obj;
}