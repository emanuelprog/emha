import { api } from 'boot/axios';

export async function fetchCharts(chartType: string) {
    const response = await api.get('/chart', {
        params: {
            chartType: chartType
        }
    });

    return response.data.obj;
}