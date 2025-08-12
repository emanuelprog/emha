import { api } from 'boot/axios';
import type { PersonOnlineFilter } from 'src/types/personOnlineType';

export async function fetchInscriptionsByPersonOnline(personOnlineId: number) {
    const response = await api.get('/inscription/person-online', {
        params: {
            personOnlineId: personOnlineId
        }
    });
    return response.data.obj;
}

export async function fetchInscriptionsBySpouseAndEventComponent(filter: PersonOnlineFilter, eventComponentId: number) {
    const response = await api.post('/inscription/spouse', filter, {
        params: {
            eventComponentId: eventComponentId
        }
    });
    return response.data.obj;
}