import { api } from 'boot/axios';
import type { InscriptionType } from 'src/types/inscriptionType';
import type { PersonOnlineFilter } from 'src/types/personOnlineType';

export async function fetchInscriptionsByPersonOnline(personOnlineId: number) {
    const response = await api.get('/inscription/person-online', {
        params: {
            personOnlineId: personOnlineId
        }
    });
    return response.data.obj;
}

export async function fetchInscriptionByPersonOnlineAndEventComponent(filter: PersonOnlineFilter, eventComponentId: number) {
    const response = await api.post('/inscription/person-online/event-component', filter, {
        params: {
            eventComponentId: eventComponentId
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

export async function createInscription(inscription: InscriptionType) {
    const response = await api.post('/inscription', inscription);
    return response.data.obj;
}

export async function updateInscription(inscription: InscriptionType) {
    const response = await api.put(`/inscription/${inscription.id}`, inscription);
    return response.data.obj;
}