import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import axios from 'axios';


const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
        iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
        expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    });

    // Handle Google login response
    React.useEffect(() => {
        if (response?.type === 'success') {
            navigation.navigate('MainScreen');
        }
    }, [response]);

    const handleLogin = async () => {
        if (!username.includes('@')) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        setErrorMessage('');
        try {
            const response = await axios.post("http://192.168.0.144:5000/api/auth/login", {
                username,
                password,
            });

            if (response.status === 200) {
                alert('Login successful');
                navigation.navigate('MainScreen');
            }
        } catch (error) {
            if (error.response) {
                const message = error.response.status;
                if (message === 404) {
                    alert("Username does not exist.");
                } else if (message === 401) {
                    alert("Incorrect password.");
                } else {
                    alert("An error occurred. Please try again.");
                }
            } else {
                alert("Network error. Please check your connection.");
            }
        }
    };


    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Image source={require('../assets/Logo.png')} style={styles.logo} />
                <Text style={styles.title}>Welcome to UR<Text style={styles.smol}>i</Text>A!</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#ddd"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#ddd"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Updated Login Button */}
                <TouchableOpacity style={styles.actionButton} onPress={handleLogin}>
                    <Text style={styles.actionButtonText}>Login at iURiT</Text>
                </TouchableOpacity>

                {/* Google Sign-In Button */}
                <TouchableOpacity style={styles.actionButtonWhite} onPress={() => promptAsync()}>
                    <Image source={require('../assets/google.png')} style={styles.googleIcon} />
                    <Text style={styles.googleText}>Sign Up with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                    <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#659561',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginVertical: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        marginBottom: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    input: {
        width: 280,
        padding: 12,
        marginBottom: 10,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#fff',
        textAlign: 'center',
    },
    /* Updated Button Style */
    actionButton: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 30,
        marginTop: 10,
        width: 280,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    /* Google Button */
    actionButtonWhite: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 30,
        marginTop: 10,
        width: 280,
        justifyContent: 'center',
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    signupText: {
        marginTop: 20,
        color: '#fff',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    smol: {
        fontSize: 20,
    },
});
