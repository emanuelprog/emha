import { api } from 'boot/axios';

export async function fetchUser(username: string, password: string) {
    const response = await api.post('/user', { login: username, password: password });

    return response.data.obj;
}