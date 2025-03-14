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

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackButton onPress={handleBackPress} />
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
                <TouchableOpacity style={styles.option} onPress={() => setShowPrivacy(!showPrivacy)}>
                    <Text style={styles.optionText}>Privacy Policy</Text>
                </TouchableOpacity>
                {showPrivacy && <Text style={styles.policyText}>At iURTaste, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our app. We collect information such as your name, email address, phone number, delivery address, and payment details to process orders securely. Additionally, we may collect location data to ensure accurate deliveries if you grant us access. We use this information to enhance your experience, process orders, provide personalized recommendations, and send promotional offers if you opt-in. Your information may be shared with trusted service providers, such as delivery partners and payment processors, but only to the extent necessary to complete your orders. We may also disclose information to comply with legal obligations. You can update or delete your profile information at any time and opt-out of marketing communications through app settings. For any questions regarding our privacy practices, please contact us at <Text style={styles.email}>support@iurtaste.com</Text>.

                </Text>}
                <TouchableOpacity style={styles.option} onPress={() => setShowTerms(!showTerms)}>
                    <Text style={styles.optionText}>Terms of Service</Text>
                </TouchableOpacity>
                {showTerms && <Text style={styles.policyText}>By using iURTaste, you agree to these Terms of Service. You must provide accurate information during sign-up and keep your account details secure. Orders placed through the app should be reviewed for accuracy before confirmation, and payments are processed securely. You can cancel orders only before preparation begins, and refunds are available for incorrect or missing items. Prohibited activities include any fraudulent or unauthorized use of the app or actions that could harm the app or other users. We are not liable for delivery delays caused by factors beyond our control. If you have any questions or concerns about these terms, please contact us at support@iurtaste.com.

                </Text>}
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
    email: {
        color: '#000000',
    },
});
