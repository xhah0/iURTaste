import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, BackHandler } from 'react-native';
import BackButton from "../components/BackButton";
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeliveryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const order = route.params?.order;

    // Disable swipe-back gesture if possible and override hardware back
    useEffect(() => {
        navigation.setOptions({ gestureEnabled: false });
        const backAction = () => {
            navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] });
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [navigation]);

    // If an order was passed, display it; otherwise, load saved orders.
    if (order) {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleString();

        const renderItem = ({ item }) => (
            <View style={styles.itemCard}>
                <Image source={item.image} style={styles.foodImage} />
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
                    <Text style={styles.itemDetails}>Price: {item.price}</Text>
                </View>
            </View>
        );

        return (
            <View style={styles.container}>
                <BackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] })} />
                <Text style={styles.header}>Order Ongoing</Text>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderText}>Order ID: {order.id}</Text>
                    <Text style={styles.orderText}>Placed on: {formattedDate}</Text>
                    <Text style={styles.orderTotal}>Total: {order.total.toFixed(2)} ALL</Text>
                </View>
                <FlatList
                    data={order.items}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.itemsList}
                />
            </View>
        );
    } else {
        // If no new order is passed, load all saved orders (if any) from AsyncStorage.
        // For simplicity, this branch could be expanded as needed.
        return (
            <View style={styles.container}>
                <BackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] })} />
                <Text style={styles.header}>Order Ongoing</Text>
                <Text style={styles.noOrders}>No orders found.</Text>
            </View>
        );
    }
};

export default DeliveryScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#659561', paddingTop: 50, paddingHorizontal: 10 },
    header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#fff' },
    orderInfo: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
    orderText: { fontSize: 16, color: '#333', marginBottom: 5 },
    orderTotal: { fontSize: 18, fontWeight: 'bold', color: '#659561', marginBottom: 10 },
    itemsList: { paddingBottom: 10 },
    itemCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
    foodImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    itemDetails: { fontSize: 14, color: '#777' },
    noOrders: { fontSize: 18, color: '#fff', textAlign: 'center', marginTop: 20 },
});
