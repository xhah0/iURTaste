import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://172.20.10.5:5000'; // 👈 Use your local IP here

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[ATTACHED TOKEN]', token); // ✅ Add this for confirmation
    }
    return config;
});

export default api;
