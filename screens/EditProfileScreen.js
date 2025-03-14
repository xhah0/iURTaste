import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';

const EditProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            const savedName = await AsyncStorage.getItem('profileName');
            const savedEmail = await AsyncStorage.getItem('profileEmail');
            if (savedName) setName(savedName);
            if (savedEmail) setEmail(savedEmail);
        };
        loadProfile();
    }, []);

    const handleSave = async () => {
        await AsyncStorage.setItem('profileName', name);
        await AsyncStorage.setItem('profileEmail', email);
        alert('Profile updated!');
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.content}>
                <Text style={styles.title}>Edit Profile</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    placeholderTextColor="#ddd"
                />
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor="#ddd"
                    keyboardType="email-address"
                />
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#659561',
        paddingTop: 50,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#fff',
        padding: 12,
        marginBottom: 15,
        borderRadius: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
