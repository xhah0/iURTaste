import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';

const RestaurantScreen = () => {
    const { user, token, logout } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // New item form state
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newImage, setNewImage] = useState('');

    const fetchData = async () => {
        try {
            // 1) fetch all restaurants, find mine by owner
            const rRes = await fetch(`${api.baseUrl}/restaurants`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const allR = await rRes.json();
            const myR = allR.find((r) => r.owner._id === user._id);
            setRestaurant(myR);

            // 2) fetch my menu
            const mRes = await fetch(
                `${api.baseUrl}/restaurants/${myR._id}/menu`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const mJson = await mRes.json();
            setMenuItems(mJson);

            // 3) fetch my orders
            const oRes = await fetch(`${api.baseUrl}/orders/restaurant`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const oJson = await oRes.json();
            setOrders(oJson);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addMenuItem = async () => {
        try {
            await fetch(
                `${api.baseUrl}/restaurants/${restaurant._id}/menu`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: newName,
                        description: newDesc,
                        price: parseFloat(newPrice),
                        image: newImage,
                    }),
                }
            );
            // clear form & refresh
            setNewName('');
            setNewDesc('');
            setNewPrice('');
            setNewImage('');
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteMenuItem = async (id) => {
        try {
            await fetch(`${api.baseUrl}/menu/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading || !restaurant) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    const renderMenuItem = ({ item }) => (
        <View style={itemStyles.card}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Price: ${item.price.toFixed(2)}</Text>
            <TouchableOpacity
                style={[styles.actionButton, { marginTop: 6 }]}
                onPress={() => deleteMenuItem(item._id)}
            >
                <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    const renderOrder = ({ item }) => (
        <View style={itemStyles.card}>
            <Text style={{ fontWeight: 'bold' }}>Order #{item._id}</Text>
            <Text>Customer: {item.customer.name}</Text>
            <Text>Status: {item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{restaurant.name}</Text>

            {/* Add Menu Item Form */}
            <Text style={[styles.title, { fontSize: 20, marginTop: 10 }]}>
                Add Menu Item
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#ddd"
                value={newName}
                onChangeText={setNewName}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#ddd"
                value={newDesc}
                onChangeText={setNewDesc}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                placeholderTextColor="#ddd"
                keyboardType="numeric"
                value={newPrice}
                onChangeText={setNewPrice}
            />
            <TextInput
                style={styles.input}
                placeholder="Image URL"
                placeholderTextColor="#ddd"
                value={newImage}
                onChangeText={setNewImage}
            />
            <TouchableOpacity style={styles.actionButton} onPress={addMenuItem}>
                <Text style={styles.actionButtonText}>Create Item</Text>
            </TouchableOpacity>

            {/* Menu List */}
            <Text style={[styles.title, { fontSize: 20, marginTop: 20 }]}>
                Menu Items
            </Text>
            <FlatList
                data={menuItems}
                keyExtractor={(m) => m._id}
                renderItem={renderMenuItem}
                style={{ width: '100%' }}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* Orders */}
            <Text style={[styles.title, { fontSize: 20, marginTop: 20 }]}>
                Incoming Orders
            </Text>
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

export default RestaurantScreen;
