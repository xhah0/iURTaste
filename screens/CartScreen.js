import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { API_URL } from "../api";
import BackButton from "../components/BackButton";

const CartScreen = () => {
    const navigation = useNavigation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Fetch cart from backend
    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await api.get(`${API_URL}/api/cart/`);
            const data = response.data;

            if (data && data.items) {
                const mappedItems = data.items.map((item) => ({
                    id: item.menuItem._id,
                    name: item.menuItem.name,
                    price: item.menuItem.price,
                    image: item.menuItem.image || null,
                    quantity: item.quantity,
                    restaurantId: item.menuItem.restaurantId || item.menuItem.restaurant?._id || null,
                }));
                setCartItems(mappedItems);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            Alert.alert("Error", "Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Increase or decrease quantity by delta
    const updateQuantity = async (productId, delta) => {
        const item = cartItems.find((i) => i.id === productId);
        if (!item) return;

        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) {
            Alert.alert(
                "Remove Item",
                `Remove ${item.name} from the cart?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Remove", style: "destructive", onPress: () => removeItem(productId) },
                ]
            );
            return;
        }

        setUpdatingItemId(productId);
        try {
            await api.post(`${API_URL}/api/cart/add`, {
                menuItemId: productId,
                quantity: delta,
            });
            await fetchCart();
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to update cart");
        } finally {
            setUpdatingItemId(null);
        }
    };

    // Remove item from cart
    const removeItem = async (productId) => {
        setUpdatingItemId(productId);
        try {
            await api.post(`${API_URL}/api/cart/remove`, { menuItemId: productId });
            await fetchCart();
        } catch (error) {
            Alert.alert("Error", "Failed to remove item from cart");
        } finally {
            setUpdatingItemId(null);
        }
    };

    // Calculate total price of cart
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Fetch payment intent from backend (mock URL, replace with your real backend)
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
            console.error("Payment intent error:", error);
            Alert.alert("Payment Error", "Failed to initiate payment");
            return null;
        }
    };

    // Create order, clear cart, and navigate to DeliveryScreen
    // const createAndNavigateOrder = async () => {
    //     const order = {
    //         id: Date.now().toString(),
    //         items: [...cartItems],
    //         total: calculateTotal(),
    //         date: new Date().toISOString(),
    //     };
    //
    //     try {
    //         // Save order locally, or replace this with backend call if you want
    //         const existingOrdersStr = await AsyncStorage.getItem("orders");
    //         let existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    //         existingOrders.push(order);
    //         await AsyncStorage.setItem("orders", JSON.stringify(existingOrders));
    //     } catch (error) {
    //         console.error("Error saving order:", error);
    //     }
    //
    //     setCartItems([]);
    //
    //     // Navigate to DeliveryScreen with order details
    //     navigation.reset({
    //         index: 1,
    //         routes: [
    //             { name: "MainScreen" }, // optional, your main/home screen
    //             { name: "DeliveryScreen", params: { order } },
    //         ],
    //     });
    // };

    // const createAndNavigateOrder = async () => {
    //     if (cartItems.length === 0) {
    //         Alert.alert("Cart is empty", "Add some items to place an order.");
    //         return;
    //     }
    //
    //     try {
    //         setLoading(true);
    //
    //         // TODO: Replace with actual delivery address logic
    //         const deliveryAddress = "Some Address";
    //
    //         // Assuming all items come from the same restaurant,
    //         // you might want to pass restaurantId in the cartItems or pass it from route.params.
    //         // If not included in cartItems, pass from route params or state.
    //         const restaurantId = cartItems[0]?.restaurantId ;
    //         if (!restaurantId) {
    //             Alert.alert("Error", "Restaurant information is missing.");
    //             setLoading(false);
    //             return;
    //         }
    //
    //         const paymentMethod = selectedPayment === "card" ? "card" : "cod";
    //
    //         // Build items for backend order
    //         const items = cartItems.map(item => ({
    //             menuItemId: item.id,
    //             quantity: item.quantity,
    //         }));
    //
    //         // Call backend API to create the order
    //         const response = await api.post(`${API_URL}/api/order/`, {
    //             restaurantId,
    //             items,
    //             deliveryAddress,
    //             paymentMethod,
    //         });
    //
    //         // Clear backend cart
    //         await api.post(`${API_URL}/api/cart/clear`);
    //
    //         // Clear local cart (AsyncStorage)
    //         await AsyncStorage.removeItem("cart");
    //
    //         // Clear local state cartItems to update UI immediately
    //         setCartItems([]);
    //
    //         setLoading(false);
    //
    //         // Navigate to DeliveryScreen with the order info returned from backend
    //         navigation.reset({
    //             index: 1,
    //             routes: [
    //                 { name: "MainScreen" },
    //                 { name: "DeliveryScreen", params: { order: response.data } },
    //             ],
    //         });
    //     } catch (error) {
    //         setLoading(false);
    //         console.error("Order creation error:", error.response?.data || error.message);
    //         Alert.alert("Order Failed", "Could not place the order. Please try again.");
    //     }
    // };

    const createAndNavigateOrder = async () => {
        if (cartItems.length === 0) {
            Alert.alert("Cart is empty", "Add some items to place an order.");
            return;
        }

        try {
            setLoading(true);

            const deliveryAddress = "Some Address"; // Replace with real logic

            console.log("Cart Items:", cartItems);

            const restaurantId = cartItems[0]?.restaurantId;
            if (!restaurantId) {
                Alert.alert("Error", "Restaurant information is missing.");
                setLoading(false);
                return;
            }

            const paymentMethod = selectedPayment === "card" ? "card" : "cod";

            const items = cartItems.map(item => ({
                menuItemId: item.id,  // use _id here (not id)
                quantity: item.quantity,
            }));

            const response = await api.post(`${API_URL}/api/order/`, {
                restaurantId,
                items,
                deliveryAddress,
                paymentMethod,
            });

            await api.post(`${API_URL}/api/cart/clear`);
            await AsyncStorage.removeItem("cart");
            setCartItems([]);
            setLoading(false);

            navigation.reset({
                index: 1,
                routes: [
                    { name: "MainScreen" },
                    { name: "DeliveryScreen", params: { order: response.data } },
                ],
            });

        } catch (error) {
            setLoading(false);
            console.error("Order creation error:", error.response?.data || error.message);
            Alert.alert("Order Failed", "Could not place the order. Please try again.");
        }
    };


    // Handle Stripe card payment
    const handleStripePayment = async () => {
        setPaymentLoading(true);
        const clientSecret = await fetchPaymentIntent();
        if (!clientSecret) {
            setPaymentLoading(false);
            return;
        }

        const { error } = await initPaymentSheet({ paymentIntentClientSecret: clientSecret });
        if (!error) {
            const { error: presentError } = await presentPaymentSheet();
            if (!presentError) {
                Alert.alert("Payment Successful!", "Thank you for your order!");
                await createAndNavigateOrder();
            } else {
                Alert.alert("Payment Failed", presentError.message);
            }
        } else {
            Alert.alert("Payment Initialization Failed", error.message);
        }
        setPaymentLoading(false);
    };

    // Handle cash payment
    const handleCashPayment = async () => {
        Alert.alert("Order Confirmed!", "You have chosen to pay with cash upon delivery.");
        await createAndNavigateOrder();
    };

    // Render single cart item row
    const renderOrderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image
                source={item.image ? { uri: item.image } : require("../assets/profile.png")}
                style={styles.image}
            />
            <View style={styles.details}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.price}>
                    {item.price} x {item.quantity}
                </Text>
            </View>
            <View style={styles.quantityContainer}>
                <TouchableOpacity
                    onPress={() => updateQuantity(item.id, -1)}
                    style={styles.quantityButton}
                    disabled={updatingItemId === item.id}
                >
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                {updatingItemId === item.id ? (
                    <ActivityIndicator size="small" color="#659561" style={{ marginHorizontal: 10 }} />
                ) : (
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                )}

                <TouchableOpacity
                    onPress={() => updateQuantity(item.id, 1)}
                    style={styles.quantityButton}
                    disabled={updatingItemId === item.id}
                >
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={styles.title}>Your Cart</Text>

            {cartItems.length === 0 ? (
                <Text style={styles.emptyCart}>Your cart is empty!</Text>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.id}
                        renderItem={renderOrderItem}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                    <Text style={styles.totalPrice}>Total: {calculateTotal().toFixed(2)} ALL</Text>

                    <View style={styles.paymentOptions}>
                        <TouchableOpacity
                            style={[styles.paymentButton, selectedPayment === "cash" && styles.selectedPayment]}
                            onPress={() => setSelectedPayment("cash")}
                        >
                            <Text style={styles.paymentButtonText}>Cash</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.paymentButton, selectedPayment === "card" && styles.selectedPayment]}
                            onPress={() => setSelectedPayment("card")}
                        >
                            <Text style={styles.paymentButtonText}>Card</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        disabled={selectedPayment === null || paymentLoading}
                        onPress={selectedPayment === "card" ? handleStripePayment : handleCashPayment}
                        style={[
                            styles.placeOrderButton,
                            (selectedPayment === null || paymentLoading) && { backgroundColor: "gray" },
                        ]}
                    >
                        {paymentLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.placeOrderButtonText}>Place Order</Text>
                        )}
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#212121",
        flex: 1,
        paddingHorizontal: 16,
    },
    center: {
        flex: 1,
        backgroundColor: "#212121",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginVertical: 16,
        textAlign: "center",
    },
    emptyCart: {
        color: "#fff",
        textAlign: "center",
        marginTop: 40,
    },
    cartItem: {
        backgroundColor: "#272727",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    details: {
        flex: 1,
        marginLeft: 10,
    },
    itemName: {
        fontSize: 18,
        color: "#fff",
    },
    price: {
        fontSize: 16,
        color: "#ccc",
        marginTop: 5,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        backgroundColor: "#659561",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    quantityButtonText: {
        color: "#fff",
        fontSize: 20,
    },
    quantityText: {
        color: "#fff",
        marginHorizontal: 10,
        fontSize: 18,
    },
    totalPrice: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 22,
        textAlign: "center",
        marginVertical: 15,
    },
    paymentOptions: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    paymentButton: {
        borderWidth: 1,
        borderColor: "#659561",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        marginHorizontal: 15,
    },
    selectedPayment: {
        backgroundColor: "#659561",
    },
    paymentButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    placeOrderButton: {
        backgroundColor: "#659561",
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: "center",
        marginBottom: 20,
    },
    placeOrderButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
    },
});

export default CartScreen;
