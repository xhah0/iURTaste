import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';

const DeliveryDashboardScreen = () => {
    const { token, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${api.baseUrl}/delivery/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${api.baseUrl}/delivery/update-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ orderId, status: newStatus }),
            });
            if (!res.ok) throw new Error('Update failed');
            await fetchOrders(); // refresh list
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    const renderOrder = ({ item }) => (
        <View style={itemStyles.card}>
            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>
                Order #{item._id}
            </Text>
            <Text>Restaurant: {item.restaurant.name || item.restaurant}</Text>
            <Text>Address: {item.deliveryAddress}</Text>
            <Text>Status: {item.status}</Text>

            {item.status !== 'delivering' && (
                <TouchableOpacity
                    style={[styles.actionButton, { marginTop: 10 }]}
                    onPress={() => updateStatus(item._id, 'delivering')}
                >
                    <Text style={styles.actionButtonText}>Mark Delivering</Text>
                </TouchableOpacity>
            )}
            {item.status !== 'completed' && (
                <TouchableOpacity
                    style={[styles.actionButton, { marginTop: 6 }]}
                    onPress={() => updateStatus(item._id, 'completed')}
                >
                    <Text style={styles.actionButtonText}>Mark Completed</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Delivery Dashboard</Text>
            <FlatList
                data={orders}
                keyExtractor={(o) => o._id}
                renderItem={renderOrder}
                style={{ width: '100%' }}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <TouchableOpacity style={styles.actionButton} onPress={logout}>
                <Text style={styles.actionButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const itemStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 12,
        marginVertical: 6,
        borderRadius: 12,
        width: '90%',
        alignSelf: 'center',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#659561',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginVertical: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        marginBottom: 20,
        color: '#fff',
        fontWeight: 'bold',
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
        color: '#000000',
    },
    actionButtonWhite: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 30,
        marginTop: 10,
        width: 280,
        justifyContent: 'center',
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    signupText: {
        marginTop: 20,
        color: '#fff',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default DeliveryDashboardScreen;
