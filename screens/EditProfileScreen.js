import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";
import api, {API_URL} from "./api/user";
import {useNavigation} from "@react-navigation/native";


const EditProfileScreen = () => {

    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // const [userId, setUserId] = useState(null);
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    // const [oldPassword, setOldPassword] = useState('');
    // const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            // const storedUserId = await AsyncStorage.getItem('_id'); // Assuming you save userId
            // const savedUsername = await AsyncStorage.getItem('profileName');
            // const savedEmail = await AsyncStorage.getItem('profileEmail');
            //
            // if (storedUserId) setUserId(storedUserId);
            // if (savedUsername) setUsername(savedUsername);
            // if (savedEmail) setEmail(savedEmail);
            try {
                const savedName = await AsyncStorage.getItem('profileName');
                const savedEmail = await AsyncStorage.getItem('profileEmail');

                if (savedName) setName(savedName);
                if (savedEmail) setEmail(savedEmail);
            } catch (error) {
                console.error("Error loading profile data", error);
            }
        };
        loadProfile();
    }, []);


    const handleSave = async () => {
        try {
            if (!name.trim() || !email.trim()) {
                Alert.alert("Error", "Name and email cannot be empty.");
                return;
            }

            await AsyncStorage.setItem('profileName', name);
            await AsyncStorage.setItem('profileEmail', email);
            Alert.alert("Success", "Profile updated successfully!");
            navigation.goBack(); // Navigate back to ProfileScreen
        } catch (error) {
            console.error("Error saving profile", error);
        }
    };


    const handlePasswordChange = async () => {
        try {
            const savedPassword = await AsyncStorage.getItem('profilePassword');

            if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
                Alert.alert("Error", "All password fields are required.");
                return;
            }

            if (savedPassword && savedPassword !== currentPassword) {
                Alert.alert("Error", "Current password is incorrect.");
                return;
            }

            if (newPassword !== confirmPassword) {
                Alert.alert("Error", "New password and confirmation do not match.");
                return;
            }

            await AsyncStorage.setItem('profilePassword', newPassword);
            Alert.alert("Success", "Password updated successfully!");
        } catch (error) {
            console.error("Error updating password", error);
        }
    };
    // Update profile (username/email)
    const handleUpdateProfile = async () => {
        try {
            const response = await api.put(`${API_URL}/api/auth/update-profile`, { username, email });
            setUser(response.data.user);
            Alert.alert("Success", "Profile updated successfully");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to update profile");
        }
    };

    // Change password
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            Alert.alert("Error", "Please enter both old and new passwords");
            return;
        }
        try {
            await axios.put(`${API_URL}/api/auth/change-password`, { oldPassword, newPassword });
            Alert.alert("Success", "Password updated successfully");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to change password");
        }
    };

    // Pick profile picture
    const pickImage = async () => {
        await ImagePicker.launchImageLibrary({mediaType: "photo"}, async (response) => {
            if (response.assets && response.assets.length > 0) {
                setProfilePic(response.assets[0].uri);
                // Upload logic to backend goes here (optional)
            }
        });
    };


    // Handle Username Change
    const handleUsernameChange = async () => {
        if (!userId) return Alert.alert("Error", "User ID not found.");
        if (!username) return Alert.alert("Error", "Username cannot be empty.");

        const response = await updateUsername(userId, username);
        if (response.message === "Username updated successfully") {
            await AsyncStorage.setItem('profileName', username);
            Alert.alert("Success", response.message);
        } else {
            Alert.alert("Error", response.message);
        }
    };

    // Handle Email Change
    const handleEmailChange = async () => {
        if (!userId) return Alert.alert("Error", "User ID not found.");
        if (!email) return Alert.alert("Error", "Email cannot be empty.");

        const response = await updateEmail(userId, email);
        if (response.message === "Email updated successfully") {
            await AsyncStorage.setItem('profileEmail', email);
            Alert.alert("Success", response.message);
        } else {
            Alert.alert("Error", response.message);
        }
    };

    // // Handle Password Change
    // const handlePasswordChange = async () => {
    //     if (!userId) return Alert.alert("Error", "User ID not found.");
    //     if (!oldPassword || !newPassword) return Alert.alert("Error", "All password fields are required.");
    //
    //     const response = await updatePassword(userId, oldPassword, newPassword);
    //     if (response.message === "Password updated successfully") {
    //         setOldPassword('');
    //         setNewPassword('');
    //         Alert.alert("Success", response.message);
    //     } else {
    //         Alert.alert("Error", response.message);
    //     }
    // };

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            {/*<View style={styles.content}>*/}
            {/*    <Text style={styles.title}>Edit Profile</Text>*/}

            {/*    /!* Username Input *!/*/}
            {/*    <TextInput*/}
            {/*        style={styles.input}*/}
            {/*        value={username}*/}
            {/*        onChangeText={setUsername}*/}
            {/*        placeholder="Username"*/}
            {/*        placeholderTextColor="#ddd"*/}
            {/*    />*/}
            {/*    <TouchableOpacity style={styles.button} onPress={handleUsernameChange}>*/}
            {/*        <Text style={styles.buttonText}>Change Username</Text>*/}
            {/*    </TouchableOpacity>*/}


            {/*    /!* Email Input *!/*/}
            {/*    <TextInput*/}
            {/*        style={styles.input}*/}
            {/*        value={email}*/}
            {/*        onChangeText={setEmail}*/}
            {/*        placeholder="Email"*/}
            {/*        placeholderTextColor="#ddd"*/}
            {/*        keyboardType="email-address"*/}
            {/*    />*/}
            {/*    <TouchableOpacity style={styles.button} onPress={handleEmailChange}>*/}
            {/*        <Text style={styles.buttonText}>Change Email</Text>*/}
            {/*    </TouchableOpacity>*/}

            {/*    /!* Password Inputs *!/*/}
            {/*    <TextInput*/}
            {/*        style={styles.input}*/}
            {/*        value={oldPassword}*/}
            {/*        onChangeText={setOldPassword}*/}
            {/*        placeholder="Current Password"*/}
            {/*        placeholderTextColor="#ddd"*/}
            {/*        secureTextEntry*/}
            {/*    />*/}
            {/*    <TextInput*/}
            {/*        style={styles.input}*/}
            {/*        value={newPassword}*/}
            {/*        onChangeText={setNewPassword}*/}
            {/*        placeholder="New Password"*/}
            {/*        placeholderTextColor="#ddd"*/}
            {/*        secureTextEntry*/}
            {/*    />*/}
            {/*    <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>*/}
            {/*        <Text style={styles.buttonText}>Change Password</Text>*/}
            {/*    </TouchableOpacity>*/}

            {/*    /!*<TextInput*!/*/}
            {/*    /!*    style={styles.input}*!/*/}
            {/*    /!*    value={name}*!/*/}
            {/*    /!*    onChangeText={setName}*!/*/}
            {/*    /!*    placeholder="Name"*!/*/}
            {/*    /!*    placeholderTextColor="#ddd"*!/*/}
                {/*/>*/}
            {/*    /!*<TextInput*!/*/}
            {/*    /!*    style={styles.input}*!/*/}
            {/*    /!*    value={email}*!/*/}
            {/*    /!*    onChangeText={setEmail}*!/*/}
            {/*    /!*    placeholder="Email"*!/*/}
            {/*    /!*    placeholderTextColor="#ddd"*!/*/}
            {/*    /!*    keyboardType="email-address"*!/*/}
                {/*/>*/}
            {/*    /!*<TouchableOpacity style={styles.button} onPress={handleSave}>*!/*/}
            {/*    /!*    <Text style={styles.buttonText}>Save Changes</Text>*!/*/}
            {/*    /!*</TouchableOpacity>*!/*/}

            {/*</View>*/}
            {/*<View style={{ padding: 20 }}>*/}
            {/*    <Text>Username:</Text>*/}
            {/*    <TextInput style={{ borderWidth: 1, marginBottom: 10 }} value={username} onChangeText={setUsername} />*/}

            {/*    <Text>Email:</Text>*/}
            {/*    <TextInput style={{ borderWidth: 1, marginBottom: 10 }} value={email} onChangeText={setEmail} />*/}

            {/*    <Button title="Update Profile" onPress={handleUpdateProfile} />*/}

            {/*    <Text style={{ marginTop: 20 }}>Change Password:</Text>*/}
            {/*    <TextInput*/}
            {/*        style={{ borderWidth: 1, marginBottom: 10 }}*/}
            {/*        value={oldPassword}*/}
            {/*        onChangeText={setOldPassword}*/}
            {/*        placeholder="Current Password"*/}
            {/*        secureTextEntry*/}
            {/*    />*/}
            {/*    <TextInput*/}
            {/*        style={{ borderWidth: 1, marginBottom: 10 }}*/}
            {/*        value={newPassword}*/}
            {/*        onChangeText={setNewPassword}*/}
            {/*        placeholder="New Password"*/}
            {/*        secureTextEntry*/}
            {/*    />*/}
            {/*    <Button title="Change Password" onPress={handleChangePassword} />*/}
            {/*</View>*/}
            <View style={styles.container}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                />

                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />

                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </View>
            );
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
