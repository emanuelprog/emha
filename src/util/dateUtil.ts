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

export function toBRDate(input: unknown): string | null {
    if (input == null) return null;

    let s: string;

    if (typeof input === 'string') {
        s = input.trim();
    } else if (typeof input === 'number') {
        s = String(input);
    } else if (input instanceof Date) {
        // converte Date para yyyy-MM-dd
        s = input.toISOString().slice(0, 10);
    } else {
        return null; // não tenta converter objetos genéricos
    }

    if (!s) return null;

    // já está em dd/MM/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s;

    // yyyy-MM-dd ou yyyy-MM-ddTHH:mm:ss...
    const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        const [, y, m, d] = isoMatch;
        return `${d}/${m}/${y}`;
    }

    // fallback para valores só com dígitos
    const onlyDigits = s.replace(/[^\d]/g, '');
    if (onlyDigits.length === 8) {
        const y = Number(onlyDigits.slice(0, 4));
        if (y >= 1900) {
            const m = onlyDigits.slice(4, 6);
            const d = onlyDigits.slice(6, 8);
            return `${d}/${m}/${y}`;
        } else {
            const d = onlyDigits.slice(0, 2);
            const m = onlyDigits.slice(2, 4);
            const y2 = onlyDigits.slice(4, 8);
            return `${d}/${m}/${y2}`;
        }
    }

    return null;
}