import { date } from 'quasar';

export function formatDate(dateInput: Date | string): string {
    const parsed = typeof dateInput === 'string'
        ? date.extractDate(dateInput, 'YYYY-MM-DD')
        : dateInput;

    return parsed ? date.formatDate(parsed, 'DD/MM/YYYY') : '';
}

export function formatTime(dateInput: Date | string): string | null {
    const parsed = typeof dateInput === 'string'
        ? date.extractDate(dateInput, 'YYYY-MM-DDTHH:mm:ss')
        : dateInput;

    if (!parsed) return null;

    const time = date.formatDate(parsed, 'HH:mm');
    return time === '00:00' ? null : time;
}
