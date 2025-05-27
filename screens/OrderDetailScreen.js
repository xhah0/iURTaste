// import React, { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     Image,
//     StyleSheet,
//     ActivityIndicator,
//     Alert,
//     SafeAreaView,
// } from "react-native";
// import { Picker } from '@react-native-picker/picker';  // import Picker
// import { useRoute, useNavigation } from "@react-navigation/native";
// import api, { API_URL } from "../api";
// import BackButton from "../components/BackButton";
//
// const OrderDetailScreen = () => {
//     const route = useRoute();
//     const navigation = useNavigation();
//
//     const { orderId } = route.params || {};
//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [updatingStatus, setUpdatingStatus] = useState(false);
//     const [selectedStatus, setSelectedStatus] = useState(null);
//
//     const possibleStatuses = [
//         "pending",
//         "accepted",
//         "preparing",
//         "delivering",
//         "completed",
//         "cancelled",
//     ];
//
//     const fetchOrder = async () => {
//         if (!orderId) {
//             Alert.alert("Error", "Order ID is missing");
//             navigation.goBack();
//             return;
//         }
//
//         setLoading(true);
//         try {
//             const response = await api.get(`${API_URL}/api/orders/${orderId}`);
//             setOrder(response.data);
//             setSelectedStatus(response.data.status);
//         } catch (error) {
//             Alert.alert("Error", "Failed to load order");
//             navigation.goBack();
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         fetchOrder();
//     }, []);
//
//     const updateStatus = async (newStatus) => {
//         if (newStatus === selectedStatus) return;
//
//         setUpdatingStatus(true);
//         try {
//             // Assuming your backend has a PATCH or PUT endpoint for updating status
//             await api.patch(`${API_URL}/api/orders/${orderId}/status`, {
//                 status: newStatus,
//             });
//
//             setSelectedStatus(newStatus);
//             setOrder(prev => ({ ...prev, status: newStatus }));
//             Alert.alert("Success", "Order status updated");
//         } catch (error) {
//             Alert.alert("Error", "Failed to update order status");
//         } finally {
//             setUpdatingStatus(false);
//         }
//     };
//
//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator size="large" color="#fff" />
//             </View>
//         );
//     }
//
//     if (!order) {
//         return null;
//     }
//
//     // Disable changing status if order is completed or cancelled
//     const statusChangeAllowed = !["completed", "cancelled"].includes(selectedStatus);
//
//     return (
//         <SafeAreaView style={styles.container}>
//             <BackButton onPress={() => navigation.goBack()} />
//             <Text style={styles.title}>Order Details</Text>
//
//             <FlatList
//                 data={order.items}
//                 keyExtractor={(item) => item.menuItem._id}
//                 renderItem={({ item }) => (
//                     <View style={styles.itemContainer}>
//                         <Image
//                             source={item.menuItem.image ? { uri: item.menuItem.image } : require("../assets/profile.png")}
//                             style={styles.image}
//                         />
//                         <View style={styles.details}>
//                             <Text style={styles.name}>{item.menuItem.name}</Text>
//                             <Text style={styles.qtyPrice}>
//                                 {item.quantity} x {item.menuItem.price} ALL
//                             </Text>
//                         </View>
//                     </View>
//                 )}
//                 contentContainerStyle={{ paddingBottom: 100 }}
//             />
//
//             <View style={styles.summary}>
//                 <Text style={styles.summaryText}>Delivery Address: {order.deliveryAddress}</Text>
//
//                 <View style={styles.totalContainer}>
//                     <Text style={styles.totalText}>Total:</Text>
//                     <Text style={styles.totalAmount}>
//                         {(order.totalAmount ?? order.total ?? 0).toFixed(2)} ALL
//                     </Text>
//                 </View>
//
//                 <Text style={[styles.summaryText, { marginTop: 20 }]}>Status:</Text>
//                 {updatingStatus ? (
//                     <ActivityIndicator size="small" color="#659561" />
//                 ) : (
//                     <Picker
//                         selectedValue={selectedStatus}
//                         onValueChange={(itemValue) => updateStatus(itemValue)}
//                         enabled={statusChangeAllowed}
//                         style={statusChangeAllowed ? styles.picker : styles.pickerDisabled}
//                     >
//                         {possibleStatuses.map((status) => (
//                             <Picker.Item
//                                 label={status.charAt(0).toUpperCase() + status.slice(1)}
//                                 value={status}
//                                 key={status}
//                             />
//                         ))}
//                     </Picker>
//                 )}
//             </View>
//         </SafeAreaView>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#212121", paddingHorizontal: 16 },
//     center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#212121" },
//     title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginVertical: 16 },
//     itemContainer: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
//     image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
//     details: { flex: 1 },
//     name: { fontSize: 18, color: "#fff", fontWeight: "600" },
//     qtyPrice: { color: "#ccc", marginTop: 4 },
//     summary: { marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#444" },
//     summaryText: { color: "#eee", fontSize: 16, marginVertical: 4 },
//     totalContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 15,
//         borderTopWidth: 1,
//         borderTopColor: "#444",
//         paddingTop: 10,
//     },
//     totalText: { fontSize: 16, fontWeight: "600", color: "#eee" },
//     totalAmount: { fontSize: 16, fontWeight: "700", color: "#659561" },
//     picker: { color: '#fff', backgroundColor: '#333', marginTop: 8 },
//     pickerDisabled: { color: '#888', backgroundColor: '#222', marginTop: 8 },
// });
//
// export default OrderDetailScreen;

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
    Alert,
    SafeAreaView,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from "@react-navigation/native";
import api, { API_URL } from "../api";
import BackButton from "../components/BackButton";

const OrderDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const { orderId } = route.params || {};
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const possibleStatuses = [
        "pending",
        "accepted",
        "preparing",
        "delivering",
        "completed",
        "cancelled",
    ];

    const fetchOrder = async () => {
        if (!orderId) {
            Alert.alert("Error", "Order ID is missing");
            navigation.goBack();
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`${API_URL}/api/orders/${orderId}`);
            setOrder(response.data);
            setSelectedStatus(response.data.status);
        } catch (error) {
            Alert.alert("Error", "Failed to load order");
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    const updateStatus = async (newStatus) => {
        if (newStatus === selectedStatus) return;

        setUpdatingStatus(true);
        try {
            await api.patch(`${API_URL}/api/orders/${orderId}/status`, {
                status: newStatus,
            });

            setSelectedStatus(newStatus);
            setOrder(prev => ({ ...prev, status: newStatus }));
            Alert.alert("Success", "Order status updated");
        } catch (error) {
            Alert.alert("Error", "Failed to update order status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!order) {
        return null;
    }

    const statusChangeAllowed = !["completed", "cancelled"].includes(selectedStatus);

    return (
        <SafeAreaView style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={styles.title}>Order Details</Text>

            <FlatList
                data={order.items}
                keyExtractor={(item) => item.menuItem._id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image
                            source={item.menuItem.image ? { uri: item.menuItem.image } : require("../assets/profile.png")}
                            style={styles.image}
                        />
                        <View style={styles.details}>
                            <Text style={styles.name}>{item.menuItem.name}</Text>
                            <Text style={styles.qtyPrice}>
                                {item.quantity} x {item.menuItem.price} ALL
                            </Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <View style={styles.summary}>
                <Text style={styles.summaryText}>Delivery Address: {order.deliveryAddress}</Text>

                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.totalAmount}>
                        {(order.totalAmount ?? order.total ?? 0).toFixed(2)} ALL
                    </Text>
                </View>

                <Text style={[styles.summaryText, { marginTop: 20 }]}>Status:</Text>
                {updatingStatus ? (
                    <ActivityIndicator size="small" color="#659561" />
                ) : (
                    <Picker
                        selectedValue={selectedStatus}
                        onValueChange={(itemValue) => updateStatus(itemValue)}
                        enabled={statusChangeAllowed}
                        style={statusChangeAllowed ? styles.picker : styles.pickerDisabled}
                    >
                        {possibleStatuses.map((status) => (
                            <Picker.Item
                                label={status.charAt(0).toUpperCase() + status.slice(1)}
                                value={status}
                                key={status}
                            />
                        ))}
                    </Picker>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#212121", paddingHorizontal: 16 },
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#212121" },
    title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginVertical: 16 },
    itemContainer: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
    image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
    details: { flex: 1 },
    name: { fontSize: 18, color: "#fff", fontWeight: "600" },
    qtyPrice: { color: "#ccc", marginTop: 4 },
    summary: { marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#444" },
    summaryText: { color: "#eee", fontSize: 16, marginVertical: 4 },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#444",
        paddingTop: 10,
    },
    totalText: { fontSize: 16, fontWeight: "600", color: "#eee" },
    totalAmount: { fontSize: 16, fontWeight: "700", color: "#659561" },
    picker: { color: '#fff', backgroundColor: '#333', marginTop: 8 },
    pickerDisabled: { color: '#888', backgroundColor: '#222', marginTop: 8 },
});

export default OrderDetailScreen;
