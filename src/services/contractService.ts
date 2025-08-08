import { api } from 'boot/axios';

export async function fetchContractByCommercialModuleAndHousingComplexesAndNumber(commercialModuleId: number, housingComplexesId: number, numberContract: number) {
    const response = await api.get('/contract/filter', {
        params: {
            commercialModuleId: commercialModuleId,
            housingComplexesId: housingComplexesId,
            number: numberContract
        }
    });

    return response.data.obj;
}