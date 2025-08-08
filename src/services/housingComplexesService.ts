import { api } from 'boot/axios';

export async function fetchHousingComplexesByCommercialModule(commercialModuleId: number) {
    const response = await api.get('/housing-complexes/commercial-module', {
        params: {
            commercialModuleId: commercialModuleId
        }
    });

    return response.data.obj;
}