import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
//import AsyncStorage from '@react-native-async-storage/async-storage';

// const getAuthHeader = async () => {
//     const token = await AsyncStorage.getItem('token');
//     return {headers:{Authorization:token}};
// }

export const API_URL =`http://172.20.10.:5000`;// Change to your backend URL


const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
//
// export const updateUsername = async ( newUsername) => {
//     try {
//         const response = await axios.put(`${API_URL}/api/user/update-username`, {  username: newUsername });
//         return response.data;
//     } catch (error) {
//         return error.response?.data || { message: "Error updating username" };
//     }
// };
//
// export const updateEmail = async ( newEmail) => {
//     try {
//         const response = await axios.put(`${API_URL}/api/user/update-email`, {  email:newEmail });
//         return response.data;
//     } catch (error) {
//         return error.response?.data || { message: "Error updating email" };
//     }
// };
//
// export const updatePassword = async ( oldPassword, newPassword) => {
//     try {
//         const response = await axios.put(`${API_URL}/api/user/update-password`, {  oldPassword, newPassword });
//         return response.data;
//     } catch (error) {
//         return error.response?.data || { message: "Error updating password" };
//     }
// };
