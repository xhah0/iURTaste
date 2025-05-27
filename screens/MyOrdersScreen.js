// MyOrdersScreen.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import BackButton from "../components/BackButton";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../api';
import moment from 'moment';

const MyOrdersScreen = () => {
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const getUserToken = async () => {
        try {
            return await AsyncStorage.getItem('userToken');
        } catch (error) {
            console.error("Error retrieving token:", error);
            return null;
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = await getUserToken();

            const response = await fetch(`${API_URL}/api/orders/my-orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch orders");
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert("Error", error.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: '#FFA726',
            accepted: '#42A5F5',
            preparing: '#7E57C2',
            delivering: '#29B6F6',
            completed: '#659561',
            cancelled: '#EF5350'
        };
        return statusColors[status] || '#666';
    };

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item._id.slice(-6).toUpperCase()}</Text>
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                    {item.status.toUpperCase()}
                </Text>
            </View>

            <Text style={styles.orderDate}>
                {moment(item.createdAt).format('MMM Do YYYY, h:mm a')}
            </Text>

            <FlatList
                data={item.items}
                keyExtractor={(item, index) => `${item._id}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.itemRow}>
                        <Text style={styles.itemName}>{item.menuItem?.name || 'Item'}</Text>
                        <Text style={styles.itemQty}>x{item.quantity}</Text>
                        <Text style={styles.itemPrice}>{item.menuItem?.price || '0'} ALL</Text>
                    </View>
                )}
            />

            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalAmount}>
                    {item.totalAmount?.toFixed(2)} ALL
                </Text>
            </View>

            {item.restaurant?.name && (
                <Text style={styles.restaurantName}>
                    {item.restaurant.name}
                </Text>
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#659561" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={styles.header}>My Orders</Text>

            {orders.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.noOrders}>No orders found</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 15,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#659561',
        textAlign: 'center',
        marginVertical: 20,
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    status: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    orderDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 15,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    itemName: {
        flex: 2,
        fontSize: 14,
        color: '#444',
    },
    itemQty: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    itemPrice: {
        flex: 1,
        fontSize: 14,
        color: '#444',
        textAlign: 'right',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#659561',
    },
    restaurantName: {
        marginTop: 10,
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noOrders: {
        fontSize: 16,
        color: '#666',
    },
    listContent: {
        paddingBottom: 20,
    },
});

export default MyOrdersScreen;