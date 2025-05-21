import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { API_URL } from '../api'; // ✅ import your configured API instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        try {
            const res = await api.post('/api/auth/login', { email, password });
            const { token, user } = res.data;

            if (!token) {
                throw new Error('Token missing in response');
            }

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(user));

            setUserToken(token);
            setUserInfo(user);
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            throw err;
        }
    };


    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
        setUserToken(null);
        setUserInfo(null);
    };

    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const user = await AsyncStorage.getItem('userInfo');

            if (token && user) {
                setUserToken(token);
                setUserInfo(JSON.parse(user));
            }
        } catch (e) {
            console.log('Failed to load auth token', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, userToken, userInfo, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
