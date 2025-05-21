import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, Alert, ScrollView,
    TouchableOpacity, KeyboardAvoidingView, Image, Platform, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import api, { API_URL } from '../api'; // ✅ adjust path if needed
import BackButton from '../components/BackButton';

export default function ProfileScreen() {
    const { userToken, userInfo } = useContext(AuthContext);
    const navigation = useNavigation();

    const [name, setName] = useState(userInfo?.name || 'Xhaho');
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const loadImage = async () => {
            const savedImage = await AsyncStorage.getItem('profileImage');
            if (savedImage) setProfileImage(savedImage);
        };
        const unsubscribe = navigation.addListener('focus', loadImage);
        return unsubscribe;
    }, [navigation]);

    const selectImage = async () => {
        try {
            const response = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
            if (response.assets?.length > 0) {
                const uri = response.assets[0].uri;
                setProfileImage(uri);
                await AsyncStorage.setItem('profileImage', uri);
            }
        } catch (error) {
            console.error('Image selection error:', error);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.navigate('LoginScreen');
    };

    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.title}>Your Profile</Text>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <TouchableOpacity onPress={selectImage}>
                        <Image source={profileImage ? { uri: profileImage } : require('../assets/profile.png')} style={styles.avatar} />
                    </TouchableOpacity>

                    <View style={styles.formWrapper}>
                        <Text style={styles.nameLabel}>Xhaho</Text>

                        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditProfileScreen')}>
                            <Text style={styles.actionButtonText}>Go to Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
                            <Text style={styles.actionButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

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
    formWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginVertical: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    nameLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
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
        color: '#000',
    },
});
