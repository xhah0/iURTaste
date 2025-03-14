import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('johndoe@example.com');

    useEffect(() => {
        const loadProfile = async () => {
            const savedName = await AsyncStorage.getItem('profileName');
            const savedEmail = await AsyncStorage.getItem('profileEmail');
            if (savedName) setName(savedName);
            if (savedEmail) setEmail(savedEmail);
        };
        const focusListener = navigation.addListener('focus', loadProfile);
        return focusListener;
    }, [navigation]);

    const handleEditProfile = () => {
        navigation.navigate('EditProfileScreen');
    };

    const handleSettings = () => {
        navigation.navigate('SettingsScreen');
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.content}>
                <Image source={require('../assets/profile.png')} style={styles.avatar} />
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
                <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSettings}>
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;

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
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    email: {
        fontSize: 16,
        color: '#ddd',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 10,
        borderRadius: 30,
        marginTop: 10,
        width: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
