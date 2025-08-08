import { api } from 'boot/axios';

export async function fetchInscriptionsByPersonOnline(personOnlineId: number) {
    const response = await api.get('/inscription/person-online', {
        params: {
            personOnlineId: personOnlineId
        }
    });
    return response.data.obj;
}