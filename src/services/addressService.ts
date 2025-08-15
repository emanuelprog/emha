import { api } from 'boot/axios';

export async function fetchAddressByZipCode(zipCode: string) {
    const response = await api.get('/address/zipCode', {
        params: {
            zipCode: zipCode
        }
    });

    return response.data.obj;
}