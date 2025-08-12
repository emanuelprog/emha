import { api } from 'boot/axios';

export async function fetchEventComponents(eventId: number) {
    const response = await api.get('/event-component/event', {
        params: {
            eventId: eventId
        }
    });

    return response.data.obj;
}