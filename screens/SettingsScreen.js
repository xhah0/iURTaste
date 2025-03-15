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
                {showPrivacy && <Text style={styles.policyText}>At iURTaste, we are committed to protecting your privacy...</Text>}
                <TouchableOpacity style={styles.option} onPress={() => setShowTerms(!showTerms)}>
                    <Text style={styles.optionText}>Terms of Service</Text>
                </TouchableOpacity>
                {showTerms && <Text style={styles.policyText}>By using iURTaste, you agree to these Terms of Service...</Text>}
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