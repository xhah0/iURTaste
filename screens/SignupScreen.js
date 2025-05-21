import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Image,
    Platform
} from 'react-native';
import { StyleSheet } from 'react-native';
import api from '../api'; // ✅ use your api instance

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role

    const handleSignup = async () => {
        if (!email.includes('@')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        try {
            const res = await api.post('/api/auth/signup', {
                name,
                email,
                password,
                role,
            });

            Alert.alert('Success', 'Account created successfully. You can log in now.');
            navigation.navigate('LoginScreen'); // navigate to login, not main
        } catch (err) {
            console.error(err);
            Alert.alert('Signup failed', err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Image source={require('../assets/Logo.png')} style={styles.logo} />
                <Text style={styles.title}>Create your UR<Text style={styles.smol}>i</Text> Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#ddd"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#ddd"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#ddd"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.actionButton} onPress={handleSignup}>
                    <Text style={styles.actionButtonText}>Sign Up at iURiT</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButtonWhite}>
                    <Image source={require('../assets/google.png')} style={styles.googleIcon} />
                    <Text style={styles.googleText}>Sign Up with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.signupText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

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
