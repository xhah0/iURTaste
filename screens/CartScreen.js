import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe } from "@stripe/stripe-react-native";
import BackButton from "../components/BackButton";

const CartScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [cartItems, setCartItems] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (route.params?.cartItems) {
            setCartItems(route.params.cartItems);
            saveCartToStorage(route.params.cartItems);
        } else {
            loadCartFromStorage();
        }
    }, [route.params]);

    const saveCartToStorage = async (cart) => {
        try {
            await AsyncStorage.setItem("cart", JSON.stringify(cart));
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    };

    const loadCartFromStorage = async () => {
        try {
            const storedCart = await AsyncStorage.getItem("cart");
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    };

    const removeFromCart = (itemId) => {
        const updatedCart = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCart);
        saveCartToStorage(updatedCart);
    };

    const incrementQuantity = (itemId) => {
        const updatedCart = cartItems.map((item) => {
            if (item.id === itemId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedCart);
        saveCartToStorage(updatedCart);
    };

    const decrementQuantity = (itemId) => {
        const updatedCart = cartItems
            .map((item) => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity - 1;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            })
            .filter((item) => item !== null);
        setCartItems(updatedCart);
        saveCartToStorage(updatedCart);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(
                typeof item.price === "string"
                    ? item.price.replace(/[^0-9.-]+/g, "")
                    : item.price
            );
            return total + price * item.quantity;
        }, 0);
    };

    const fetchPaymentIntent = async () => {
        try {
            const response = await fetch("https://your-backend.com/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: calculateTotal() * 100 }),
            });
            const { clientSecret } = await response.json();
            return clientSecret;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Create a new order object and reset the navigation stack to only MainScreen and DeliveryScreen.
    const createAndNavigateOrder = async () => {
        const order = {
            id: Date.now().toString(),
            items: [...cartItems],
            total: calculateTotal(),
            date: new Date().toISOString(),
        };

        // Optionally, save the order persistently.
        try {
            const existingOrdersStr = await AsyncStorage.getItem("orders");
            let existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
            existingOrders.push(order);
            await AsyncStorage.setItem("orders", JSON.stringify(existingOrders));
        } catch (error) {
            console.error("Error saving order:", error);
        }

        // Clear cart.
        setCartItems([]);
        saveCartToStorage([]);

        // Reset navigation so that the new stack has only MainScreen and DeliveryScreen.
        navigation.reset({
            index: 1,
            routes: [
                { name: "MainScreen" },
                { name: "DeliveryScreen", params: { order } }
            ],
        });
    };

    const handleStripePayment = async () => {
        setLoading(true);
        const clientSecret = await fetchPaymentIntent();
        if (!clientSecret) {
            setLoading(false);
            return;
        }
        const { error } = await initPaymentSheet({ paymentIntentClientSecret: clientSecret });
        if (!error) {
            await presentPaymentSheet();
            Alert.alert("Payment Successful!", "Thank you for your order!");
            await createAndNavigateOrder();
        } else {
            Alert.alert("Payment Failed", "Please try again.");
        }
        setLoading(false);
    };

    const handleCashPayment = async () => {
        Alert.alert("Order Confirmed!", "You have chosen to pay with cash upon delivery.");
        await createAndNavigateOrder();
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.price}>
                    {item.price} x {item.quantity}
                </Text>
            </View>
            <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decrementQuantity(item.id)} style={styles.decrementButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => incrementQuantity(item.id)} style={styles.incrementButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={styles.title}>Your Cart</Text>
            {cartItems.length === 0 ? (
                <Text style={styles.emptyCart}>Your cart is empty!</Text>
            ) : (
                <>
                    <FlatList data={cartItems} keyExtractor={(item) => item.id} renderItem={renderOrderItem} />
                    <Text style={styles.totalPrice}>Total: {calculateTotal().toFixed(2)} ALL</Text>
                    <View style={styles.paymentOptions}>
                        <TouchableOpacity
                            style={[styles.paymentButton, selectedPayment === "cash" && styles.selectedPayment]}
                            onPress={() => setSelectedPayment("cash")}
                        >
                            <Text style={styles.paymentText}>Pay with Cash</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.paymentButton, selectedPayment === "stripe" && styles.selectedPayment]}
                            onPress={() => setSelectedPayment("stripe")}
                        >
                            <Text style={styles.paymentText}>Pay with Stripe</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={selectedPayment === "stripe" ? handleStripePayment : handleCashPayment}
                        disabled={!selectedPayment || loading}
                    >
                        <Text style={styles.checkoutText}>{loading ? "Processing..." : "Order"}</Text>
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#659561", padding: 20 },
    title: { fontSize: 25, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 40 },
    emptyCart: { fontSize: 18, color: "#fff", textAlign: "center", marginTop: 20 },
    cartItem: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    image: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
    details: { flex: 1 },
    itemName: { fontSize: 18, fontWeight: "bold", color: "#333" },
    price: { fontSize: 16, color: "#659561", fontWeight: "bold" },
    quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    decrementButton: { backgroundColor: "red", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 },
    incrementButton: { backgroundColor: "#4CAF50", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 },
    quantityButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    quantityText: { marginHorizontal: 10, fontSize: 16, fontWeight: "bold", color: "#333" },
    totalPrice: { fontSize: 22, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 20 },
    paymentOptions: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
    paymentButton: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginHorizontal: 10 },
    selectedPayment: { backgroundColor: "#4CAF50" },
    paymentText: { fontSize: 16, fontWeight: "bold", color: "#659561" },
    checkoutButton: { backgroundColor: "#fff", padding: 15, borderRadius: 30, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
    checkoutText: { fontSize: 18, fontWeight: "bold", color: "#659561" },
});
