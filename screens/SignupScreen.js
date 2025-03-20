import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';

const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [birthday, setBirthday] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation();

    const handleSignup = async () => {
        if (!email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }
        try{
            const response = await axios.post("http://192.168.0.144:5000/api/auth/signup",{
                    name: username,
                    username,
                    email,
                    password,
                    birthday
            });

            if (response.status ===201) {
                alert("Signup successful");
                navigation.navigate("MainScreen");
            }
        }catch(error){
            console.error("Error signing up", error);
            alert("Signup failed. Please try again");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Image source={require('../assets/Logo.png')} style={styles.logo} />
                <Text style={styles.title}>Create an UR<Text style={styles.smol}>i</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#ddd"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#ddd"
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
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input} activeOpacity={1}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>{moment(birthday).format('MMMM DD, YYYY')}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={birthday}
                        mode="date"
                        display="spinner"
                        onChange={(event, date) => {
                            if (date) setBirthday(date);
                        }}
                    />
                )}
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.loginText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignupScreen;

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
        marginBottom: 15,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#fff',
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 12,
        borderRadius: 30,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loginText: {
        marginTop: 10,
        color: '#fff',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
