import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import {API_URL} from "../../screens/api/user";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            console.log(res.data.token);
            navigation.navigate('Home');
        } catch (err) {
            console.error(err);
            Alert.alert('Login failed', err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Email:</Text>
            <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderBottomWidth: 1 }} />
            <Text>Password:</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomWidth: 1 }} />
            <Button title="Login" onPress={handleLogin} />
            <Text onPress={() => navigation.navigate('Signup')}>Don't have an account? Sign up</Text>
        </View>
    );
}
