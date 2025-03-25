import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Alert,
    FlatList,
    Modal,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const albanianCities = [
    'Tirana',
    'Durres',
    'Vlore',
    'Shkodra',
    'Elbasan',
    'Berat',
    'Fier',
    'Lushnje',
    'Kruje',
    'Kukes',
];

const LocationScreen = () => {
    const navigation = useNavigation();
    const [addresses, setAddresses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [street, setStreet] = useState('');
    const [selectedCity, setSelectedCity] = useState(albanianCities[0]);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const stored = await AsyncStorage.getItem('addresses');
            if (stored) {
                setAddresses(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading addresses', error);
        }
    };

    const saveAddresses = async (newAddresses) => {
        try {
            await AsyncStorage.setItem('addresses', JSON.stringify(newAddresses));
            setAddresses(newAddresses);
        } catch (error) {
            console.error('Error saving addresses', error);
        }
    };

    const addAddress = async () => {
        if (!street) {
            Alert.alert('Incomplete', 'Please fill in the Street & Post Code field.');
            return;
        }
        const newAddress = {
            id: Date.now().toString(),
            street,
            city: selectedCity,
        };
        // Prepend new address so it appears on top
        const updatedAddresses = [newAddress, ...addresses];
        await saveAddresses(updatedAddresses);
        Alert.alert('Success', 'Address added successfully.');
        setStreet('');
        setSelectedCity(albanianCities[0]);
        setModalVisible(false);
    };

    const removeAddress = async (id) => {
        const updated = addresses.filter((addr) => addr.id !== id);
        await saveAddresses(updated);
    };

    const renderAddress = ({ item }) => (
        <View style={styles.addressCard}>
            <Text style={styles.addressText}>
                {item.street}, {item.city}
            </Text>
            <TouchableOpacity onPress={() => removeAddress(item.id)} style={styles.removeIcon}>
                <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* BackButton exactly as in DeliveryScreen (top-left) */}
            <BackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainScreen' }] })} />
            {/* Centered Title */}
            <Text style={styles.header}>Location</Text>

            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                renderItem={renderAddress}
                contentContainerStyle={styles.addressList}
                ListEmptyComponent={<Text style={styles.emptyText}>No addresses saved.</Text>}
            />

            {/* Floating Add Button */}
            <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.floatingButtonText}>Add +</Text>
            </TouchableOpacity>

            {/* Modal for Adding New Address */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            style={styles.modalWrapper}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            <ScrollView contentContainerStyle={styles.modalScroll}>
                                <TouchableWithoutFeedback>
                                    <View style={styles.modalContainer}>
                                        <Text style={styles.modalHeader}>Add New Address</Text>

                                        <Text style={styles.label}>City</Text>
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                selectedValue={selectedCity}
                                                onValueChange={(itemValue) => setSelectedCity(itemValue)}
                                                style={styles.picker}
                                                mode="dropdown"
                                            >
                                                {albanianCities.map((city) => (
                                                    <Picker.Item label={city} value={city} key={city} />
                                                ))}
                                            </Picker>
                                        </View>

                                        <Text style={styles.label}>Street & Post Code</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Street & Post Code"
                                            placeholderTextColor="#aaa"
                                            value={street}
                                            onChangeText={setStreet}
                                        />

                                        <View style={styles.modalButtons}>
                                            <TouchableOpacity
                                                style={[styles.modalButton, styles.modalCancelButton]}
                                                onPress={() => setModalVisible(false)}
                                            >
                                                <Text style={styles.modalButtonText}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.modalButton} onPress={addAddress}>
                                                <Text style={styles.modalButtonText}>Save Address</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

export default LocationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#659561',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    addressList: {
        paddingBottom: 20,
    },
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    addressText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    removeIcon: {
        backgroundColor: '#ff5252',
        padding: 5,
        borderRadius: 15,
        marginLeft: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    floatingButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#659561',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalWrapper: {
        width: '100%',
    },
    modalScroll: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 30,
        elevation: 3,
    },
    modalHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    modalCancelButton: {
        backgroundColor: '#ff5252',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
