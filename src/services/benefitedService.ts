import { api } from 'boot/axios';
import type { PersonOnlineFilter } from 'src/types/personOnlineType';

export async function fetchBenefiteds(filter: PersonOnlineFilter) {
    const response = await api.post('/benefited/person-online', filter);

    return response.data.obj;
}