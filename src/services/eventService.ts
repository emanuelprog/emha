import { api } from 'boot/axios';
import { date } from 'quasar';

export async function fetchEvent(startDate: Date, endDate: Date) {
    const response = await api.get('/event', {
        params: {
            startDate: date.formatDate(startDate, 'YYYY-MM-DD'),
            endDate: date.formatDate(endDate, 'YYYY-MM-DD')
        }
    });

    return response.data.obj;
}