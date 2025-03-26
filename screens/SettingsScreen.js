import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

    return (
        <SafeAreaView style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.headerSpacing}></View>
                <Text style={styles.title}>Settings</Text>
                <View style={styles.option}>
                    <Text style={styles.optionText}>Enable Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={toggleNotifications}
                        trackColor={{ true: '#4CAF50', false: '#767577' }}
                        thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
                    />
                </View>
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("CartScreen")}>
                    <Text style={styles.optionText}>Manage Payments</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={() => setShowPrivacy(!showPrivacy)}>
                    <Text style={styles.optionText}>Privacy Policy</Text>
                </TouchableOpacity>
                {showPrivacy && <Text style={styles.policyText}>iURTaste values privacy. The app collects personal information (e.g., name, email, contact details) during registration and gathers usage data and location (with permission) to improve functionality and enhance user experience. Data is used solely for operating the app, processing transactions, and providing personalized content, and is not sold to third parties. Although reasonable security measures are in place, no online storage is entirely secure. By using iURTaste, acceptance of these data practices is implied, and any updates to this policy will be posted for review.</Text>}
                <TouchableOpacity style={styles.option} onPress={() => setShowTerms(!showTerms)}>
                    <Text style={styles.optionText}>Terms of Service</Text>
                </TouchableOpacity>
                {showTerms && <Text style={styles.policyText}>Use of iURTaste indicates agreement to these Terms. The app is provided on an "as is" basis for personal, non-commercial use only. Registration requires accurate information, and users are responsible for keeping account credentials confidential. A limited license is granted to use the app, while all content and intellectual property remain with iURTaste or its licensors. Unauthorized reproduction or distribution of app content is prohibited and may result in termination of access. Use of iURTaste is subject to applicable laws, and by using the app, acceptance of these Terms is acknowledged.</Text>}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#659561',
        paddingTop: 50,
    },
    headerSpacing: {
        height: 40,
    },
    content: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    optionText: {
        fontSize: 18,
        color: '#fff',
    },
    policyText: {
        fontSize: 16,
        color: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginBottom: 10,
    },
});