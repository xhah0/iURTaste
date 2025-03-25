import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('johndoe@example.com');
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const savedName = await AsyncStorage.getItem('profileName');
                const savedEmail = await AsyncStorage.getItem('profileEmail');
                const savedImage = await AsyncStorage.getItem('profileImage');

                if (savedName) setName(savedName);
                if (savedEmail) setEmail(savedEmail);
                if (savedImage) setProfileImage(savedImage);
            } catch (error) {
                console.error("Error loading profile data", error);
            }
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

    const handleLogout = async () => {
        await AsyncStorage.removeItem('profileName');
        await AsyncStorage.removeItem('profileEmail');
        await AsyncStorage.removeItem('profileImage');
        navigation.navigate('LoginScreen');
    };

    const selectImage = async () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        try {
            const response = await launchImageLibrary(options);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                Alert.alert('Error', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0].uri;
                setProfileImage(selectedImage);
                await AsyncStorage.setItem('profileImage', selectedImage);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
        }
    };

    const captureImage = async () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };
        try {
            const response = await launchCamera(options);
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorMessage) {
                Alert.alert('Error', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const capturedImage = response.assets[0].uri;
                setProfileImage(capturedImage);
                await AsyncStorage.setItem('profileImage', capturedImage);
            }
        } catch (error) {
            console.error('Error capturing image:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.content}>
                <TouchableOpacity onPress={selectImage}>
                    <Image
                        source={profileImage ? { uri: profileImage } : require('../assets/profile.png')}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
                <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSettings}>
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={captureImage}>
                    <Text style={styles.buttonText}>Capture New Image</Text>
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
