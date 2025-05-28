import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';

const AdminScreen = () => {
    const { user, token, logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [uRes, oRes, rRes] = await Promise.all([
                fetch(`${api.baseUrl}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${api.baseUrl}/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${api.baseUrl}/restaurants`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            if (!uRes.ok || !oRes.ok || !rRes.ok) throw new Error('Fetch failed');
            const [uJson, oJson, rJson] = await Promise.all([
                uRes.json(),
                oRes.json(),
                rRes.json(),
            ]);
            setUsers(uJson);
            setOrders(oJson);
            setRestaurants(rJson);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    const renderItem = (label) => ({ item }) => (
        <View style={itemStyles.card}>
            {Object.entries(item).map(([k, v]) => (
                <Text key={k}>
                    <Text style={{ fontWeight: 'bold' }}>{label === 'Users' && k === 'role' ? 'Role: ' : `${k}: `}</Text>
                    {String(v)}
                </Text>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>

            <Text style={[styles.title, { fontSize: 20, marginTop: 20 }]}>Users</Text>
            <FlatList
                data={users}
                keyExtractor={(u) => u._id}
                renderItem={renderItem('Users')}
                style={{ width: '100%' }}
            />

            <Text style={[styles.title, { fontSize: 20, marginTop: 20 }]}>Orders</Text>
            <FlatList
                data={orders}
                keyExtractor={(o) => o._id}
                renderItem={renderItem('Orders')}
                style={{ width: '100%' }}
            />

            <Text style={[styles.title, { fontSize: 20, marginTop: 20 }]}>Restaurants</Text>
            <FlatList
                data={restaurants}
                keyExtractor={(r) => r._id}
                renderItem={renderItem('Restaurants')}
                style={{ width: '100%' }}
            />

            <TouchableOpacity style={[styles.actionButton, { marginTop: 30 }]} onPress={logout}>
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

export default AdminScreen;
