// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     Image,
//     TouchableOpacity,
//     BackHandler,
//     Alert,
//     ActivityIndicator,
// } from 'react-native';
// import BackButton from "../components/BackButton";
// import { useNavigation, useRoute } from '@react-navigation/native';
// import api, { API_URL } from '../api';
//
// const DeliveryScreen = () => {
//     const navigation = useNavigation();
//     const route = useRoute();
//     const orderId = route.params?.orderId;
//
//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         navigation.setOptions({ gestureEnabled: false });
//
//         const backAction = () => {
//             navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] });
//             return true;
//         };
//         const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
//
//         console.log('DeliveryScreen route.params:', route.params);
//         console.log('orderId:', orderId);
//
//         fetchOrderDetails();
//
//         return () => backHandler.remove();
//     }, []);
//
//     const fetchOrderDetails = async () => {
//         if (!orderId) {
//             Alert.alert('Error', 'No order ID provided');
//             setLoading(false);
//             return;
//         }
//
//         try {
//             setLoading(true);
//             const response = await api.get(`${API_URL}/api/orders/${orderId}`);
//             setOrder(response.data);
//         } catch (error) {
//             console.error(error.response?.data || error.message);
//             Alert.alert('Error', 'Failed to load order details.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const markAsDelivered = async () => {
//         try {
//             await api.put(`${API_URL}/api/delivery/update-status`, {
//                 orderId: order._id,
//                 status: 'delivered',
//             });
//             Alert.alert('Success', 'Order marked as delivered!', [
//                 { text: 'OK', onPress: () => navigation.navigate('MainScreen') }
//             ]);
//         } catch (error) {
//             console.error(error.response?.data || error.message);
//             Alert.alert('Error', 'Failed to update delivery status');
//         }
//     };
//
//     const renderItem = ({ item }) => {
//         let imageSource = null;
//         if (typeof item.image === 'string') {
//             imageSource = { uri: item.image };
//         } else {
//             imageSource = item.image; // local image
//         }
//
//         return (
//             <View style={styles.itemCard}>
//                 <Image source={imageSource} style={styles.foodImage} />
//                 <View style={styles.itemInfo}>
//                     <Text style={styles.itemName}>{item.name}</Text>
//                     <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
//                     <Text style={styles.itemDetails}>Price: {item.price}</Text>
//                 </View>
//             </View>
//         );
//     };
//
//     if (loading) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#fff" />
//             </View>
//         );
//     }
//
//     if (!order) {
//         return (
//             <View style={styles.container}>
//                 <BackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] })} />
//                 <Text style={styles.header}>Order Ongoing</Text>
//                 <Text style={styles.noOrders}>No orders found.</Text>
//             </View>
//         );
//     }
//
//     const orderDate = new Date(order.date);
//     const formattedDate = orderDate.toLocaleString();
//
//     return (
//         <View style={styles.container}>
//             <BackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] })} />
//             <Text style={styles.header}>Order Ongoing</Text>
//             <View style={styles.orderInfo}>
//                 <Text style={styles.orderText}>Order ID: {order._id}</Text>
//                 <Text style={styles.orderText}>Placed on: {formattedDate}</Text>
//                 <Text style={styles.orderTotal}>Total: {order.totalAmount?.toFixed(2) || 0} ALL</Text>
//             </View>
//             <FlatList
//                 data={order.items}
//                 keyExtractor={(item, index) => item._id || index.toString()}
//                 renderItem={renderItem}
//                 contentContainerStyle={styles.itemsList}
//             />
//             <TouchableOpacity style={styles.button} onPress={markAsDelivered}>
//                 <Text style={styles.buttonText}>Mark as Delivered</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };
//
// export default DeliveryScreen;
//
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#659561', paddingTop: 50, paddingHorizontal: 10 },
//     header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#fff' },
//     orderInfo: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
//     orderText: { fontSize: 16, color: '#333', marginBottom: 5 },
//     orderTotal: { fontSize: 18, fontWeight: 'bold', color: '#659561', marginBottom: 10 },
//     itemsList: { paddingBottom: 10 },
//     itemCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
//     foodImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
//     itemInfo: { flex: 1 },
//     itemName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//     itemDetails: { fontSize: 14, color: '#777' },
//     noOrders: { fontSize: 18, color: '#fff', textAlign: 'center', marginTop: 20 },
//     button: {
//         backgroundColor: '#fff',
//         padding: 12,
//         borderRadius: 30,
//         marginTop: 20,
//         width: '100%',
//         alignItems: 'center',
//     },
//     buttonText: {
//         fontWeight: 'bold',
//         color: '#000',
//     },
// });
//
//
// import React, { useEffect } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     Image,
//     TouchableOpacity,
//     BackHandler,
//     Alert,
// } from 'react-native';
// import BackButton from "../components/BackButton";
// import { useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../api';
//
// const DeliveryScreen = () => {
//     const navigation = useNavigation();
//     const route = useRoute();
//     const order = route.params?.order;
//
//     useEffect(() => {
//         navigation.setOptions({ gestureEnabled: false });
//         const backAction = () => {
//             navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] });
//             return true;
//         };
//         const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
//         return () => backHandler.remove();
//     }, [navigation]);
//
//     const markAsDelivered = async () => {
//         try {
//             const response = await api.put('/api/delivery/update-status', {
//                 orderId: order._id,
//                 status: 'delivered',
//             });
//             Alert.alert('Success', 'Order marked as delivered!', [
//                 { text: 'OK', onPress: () => navigation.navigate('MainScreen') }
//             ]);
//         } catch (error) {
//             console.error(error.response?.data || error.message);
//             Alert.alert('Error', 'Failed to update delivery status');
//         }
//     };
//
//     if (order) {
//         const orderDate = new Date(order.date);
//         const formattedDate = orderDate.toLocaleString();
//
//         const renderItem = ({ item }) => (
//             <View style={styles.itemCard}>
//                 <Image source={item.image} style={styles.foodImage} />
//                 <View style={styles.itemInfo}>
//                     <Text style={styles.itemName}>{item.name}</Text>
//                     <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
//                     <Text style={styles.itemDetails}>Price: {item.price}</Text>
//                 </View>
//             </View>
//         );
//
//         return (
//             <View style={styles.container}>
//                 <BackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] })} />
//                 <Text style={styles.header}>Order Ongoing</Text>
//                 <View style={styles.orderInfo}>
//                     <Text style={styles.orderText}>Order ID: {order._id}</Text>
//                     <Text style={styles.orderText}>Placed on: {formattedDate}</Text>
//                     <Text style={styles.orderTotal}>Total: {order.totalAmount?.toFixed(2) || 0} ALL</Text>
//                 </View>
//                 <FlatList
//                     data={order.items}
//                     keyExtractor={(item, index) => index.toString()}
//                     renderItem={renderItem}
//                     contentContainerStyle={styles.itemsList}
//                 />
//                 <TouchableOpacity style={styles.button} onPress={markAsDelivered}>
//                     <Text style={styles.buttonText}>Mark as Delivered</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     } else {
//         return (
//             <View style={styles.container}>
//                 <BackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] })} />
//                 <Text style={styles.header}>Order Ongoing</Text>
//                 <Text style={styles.noOrders}>No orders found.</Text>
//             </View>
//         );
//     }
// };
//
// export default DeliveryScreen;
//
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#659561', paddingTop: 50, paddingHorizontal: 10 },
//     header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#fff' },
//     orderInfo: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
//     orderText: { fontSize: 16, color: '#333', marginBottom: 5 },
//     orderTotal: { fontSize: 18, fontWeight: 'bold', color: '#659561', marginBottom: 10 },
//     itemsList: { paddingBottom: 10 },
//     itemCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
//     foodImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
//     itemInfo: { flex: 1 },
//     itemName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//     itemDetails: { fontSize: 14, color: '#777' },
//     noOrders: { fontSize: 18, color: '#fff', textAlign: 'center', marginTop: 20 },
//     button: {
//         backgroundColor: '#fff',
//         padding: 12,
//         borderRadius: 30,
//         marginTop: 20,
//         width: '100%',
//         alignItems: 'center',
//     },
//     buttonText: {
//         fontWeight: 'bold',
//         color: '#000',
//     },
// });
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    BackHandler,
    Alert,
    ActivityIndicator,
} from 'react-native';
import BackButton from "../components/BackButton";
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../api';

const DeliveryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const orderId = route.params?.orderId;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        navigation.setOptions({ gestureEnabled: false });
        const backAction = () => {
            navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] });
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [navigation]);

    const getUserToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            return token;
        } catch (error) {
            console.error("Error retrieving token:", error);
            return null;
        }
    };

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const token = await getUserToken();
            const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch order");
            }

            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error(error.message || error);
            Alert.alert("Error", "Failed to load order.");
        } finally {
            setLoading(false);
        }
    };

    const markAsDelivered = async () => {
        try {
            const token = await getUserToken();
            const response = await fetch(`${API_URL}/api/delivery/update-status`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderId: order._id,
                    status: 'delivered',
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update status");
            }

            Alert.alert('Success', 'Order marked as delivered!', [
                { text: 'OK', onPress: () => navigation.navigate('MainScreen') }
            ]);
        } catch (error) {
            console.error(error.message || error);
            Alert.alert('Error', 'Failed to update delivery status');
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const renderItem = ({ item }) => (
        <View style={styles.itemCard}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.foodImage} />
            ) : (
                <View style={[styles.foodImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#ddd' }]}>
                    <Text>No Image</Text>
                </View>
            )}
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
                <Text style={styles.itemDetails}>Price: {item.price} ALL</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#659561" />
                <Text>Loading order...</Text>
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.centered}>
                <Text>No order found.</Text>
            </View>
        );
    }

    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleString();

    return (
        <View style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={styles.heading}>Delivery Details</Text>
            <Text style={styles.subheading}>Order ID: {order._id}</Text>
            <Text style={styles.subheading}>Date: {formattedDate}</Text>

            <FlatList
                data={order.items}
                renderItem={renderItem}
                keyExtractor={(item, index) => item._id || index.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <TouchableOpacity style={styles.button} onPress={markAsDelivered}>
                <Text style={styles.buttonText}>Mark as Delivered</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DeliveryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#659561',
        textAlign: 'center',
    },
    subheading: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
        textAlign: 'center',
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    foodImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    itemInfo: {
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemDetails: {
        fontSize: 14,
        color: '#666',
    },
    button: {
        backgroundColor: '#659561',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
