import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BackButton from '../components/BackButton';
import api from '../api'; // adjust path if api.js is in root folder


const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "All password fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match.");
            return;
        }

        try {
            await api.post('/api/users/change-password', { currentPassword, newPassword });


            Alert.alert("Success", "Password updated!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err.response?.data || err.message);
            const msg = err.response?.data?.message || 'Something went wrong';
            Alert.alert("Error", msg);
        }
        const token = await AsyncStorage.setItem('userToken', token);
        console.log('[TOKEN IN STORAGE]', token);
    };




    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.title}>Edit Your Profile</Text>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Current Password"
                        placeholderTextColor="#ddd"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        placeholderTextColor="#ddd"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        placeholderTextColor="#ddd"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('ProfileScreen')}
                    >
                        <Text style={styles.buttonText}>Back to Profile</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#659561',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
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
    button: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 30,
        marginTop: 10,
        width: 280,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});
