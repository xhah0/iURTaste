// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useStripe } from "@stripe/stripe-react-native";
// import BackButton from "../components/BackButton";
//
// const CartScreen = () => {
//     const route = useRoute();
//     const navigation = useNavigation();
//     const { initPaymentSheet, presentPaymentSheet } = useStripe();
//     const [cartItems, setCartItems] = useState([]);
//     const [selectedPayment, setSelectedPayment] = useState(null);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         if (route.params?.cartItems) {
//             setCartItems(route.params.cartItems);
//             saveCartToStorage(route.params.cartItems);
//         } else {
//             loadCartFromStorage();
//         }
//     }, [route.params]);
//
//     const saveCartToStorage = async (cart) => {
//         try {
//             await AsyncStorage.setItem("cart", JSON.stringify(cart));
//         } catch (error) {
//             console.error("Error saving cart:", error);
//         }
//     };
//
//     const loadCartFromStorage = async () => {
//         try {
//             const storedCart = await AsyncStorage.getItem("cart");
//             if (storedCart) {
//                 setCartItems(JSON.parse(storedCart));
//             }
//         } catch (error) {
//             console.error("Error loading cart:", error);
//         }
//     };
//
//     const removeFromCart = (itemId) => {
//         const updatedCart = cartItems.filter((item) => item.id !== itemId);
//         setCartItems(updatedCart);
//         saveCartToStorage(updatedCart);
//     };
//
//     const incrementQuantity = (itemId) => {
//         const updatedCart = cartItems.map((item) => {
//             if (item.id === itemId) {
//                 return { ...item, quantity: item.quantity + 1 };
//             }
//             return item;
//         });
//         setCartItems(updatedCart);
//         saveCartToStorage(updatedCart);
//     };
//
//     const decrementQuantity = (itemId) => {
//         const updatedCart = cartItems
//             .map((item) => {
//                 if (item.id === itemId) {
//                     const newQuantity = item.quantity - 1;
//                     return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
//                 }
//                 return item;
//             })
//             .filter((item) => item !== null);
//         setCartItems(updatedCart);
//         saveCartToStorage(updatedCart);
//     };
//
//     const calculateTotal = () => {
//         return cartItems.reduce((total, item) => {
//             const price = parseFloat(
//                 typeof item.price === "string"
//                     ? item.price.replace(/[^0-9.-]+/g, "")
//                     : item.price
//             );
//             return total + price * item.quantity;
//         }, 0);
//     };
//
//     const fetchPaymentIntent = async () => {
//         try {
//             const response = await fetch("https://your-backend.com/create-payment-intent", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ amount: calculateTotal() * 100 }),
//             });
//             const { clientSecret } = await response.json();
//             return clientSecret;
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     };
//
//     // Create a new order object and reset the navigation stack to only MainScreen and DeliveryScreen.
//     const createAndNavigateOrder = async () => {
//         const order = {
//             id: Date.now().toString(),
//             items: [...cartItems],
//             total: calculateTotal(),
//             date: new Date().toISOString(),
//         };
//
//         // Optionally, save the order persistently.
//         try {
//             const existingOrdersStr = await AsyncStorage.getItem("orders");
//             let existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
//             existingOrders.push(order);
//             await AsyncStorage.setItem("orders", JSON.stringify(existingOrders));
//         } catch (error) {
//             console.error("Error saving order:", error);
//         }
//
//         // Clear cart.
//         setCartItems([]);
//         saveCartToStorage([]);
//
//         // Reset navigation so that the new stack has only MainScreen and DeliveryScreen.
//         navigation.reset({
//             index: 1,
//             routes: [
//                 { name: "MainScreen" },
//                 { name: "DeliveryScreen", params: { order } }
//             ],
//         });
//     };
//
//     const handleStripePayment = async () => {
//         setLoading(true);
//         const clientSecret = await fetchPaymentIntent();
//         if (!clientSecret) {
//             setLoading(false);
//             return;
//         }
//         const { error } = await initPaymentSheet({ paymentIntentClientSecret: clientSecret });
//         if (!error) {
//             await presentPaymentSheet();
//             Alert.alert("Payment Successful!", "Thank you for your order!");
//             await createAndNavigateOrder();
//         } else {
//             Alert.alert("Payment Failed", "Please try again.");
//         }
//         setLoading(false);
//     };
//
//     const handleCashPayment = async () => {
//         Alert.alert("Order Confirmed!", "You have chosen to pay with cash upon delivery.");
//         await createAndNavigateOrder();
//     };
//
//     const renderOrderItem = ({ item }) => (
//         <View style={styles.cartItem}>
//             <Image source={item.image} style={styles.image} />
//             <View style={styles.details}>
//                 <Text style={styles.itemName}>{item.name}</Text>
//                 <Text style={styles.price}>
//                     {item.price} x {item.quantity}
//                 </Text>
//             </View>
//             <View style={styles.quantityContainer}>
//                 <TouchableOpacity onPress={() => decrementQuantity(item.id)} style={styles.decrementButton}>
//                     <Text style={styles.quantityButtonText}>-</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.quantityText}>{item.quantity}</Text>
//                 <TouchableOpacity onPress={() => incrementQuantity(item.id)} style={styles.incrementButton}>
//                     <Text style={styles.quantityButtonText}>+</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
//
//     return (
//         <SafeAreaView style={styles.container}>
//             <BackButton onPress={() => navigation.goBack()} />
//             <Text style={styles.title}>Your Cart</Text>
//             {cartItems.length === 0 ? (
//                 <Text style={styles.emptyCart}>Your cart is empty!</Text>
//             ) : (
//                 <>
//                     <FlatList data={cartItems} keyExtractor={(item) => item.id} renderItem={renderOrderItem} />
//                     <Text style={styles.totalPrice}>Total: {calculateTotal().toFixed(2)} ALL</Text>
//                     <View style={styles.paymentOptions}>
//                         <TouchableOpacity
//                             style={[styles.paymentButton, selectedPayment === "cash" && styles.selectedPayment]}
//                             onPress={() => setSelectedPayment("cash")}
//                         >
//                             <Text style={styles.paymentText}>Pay with Cash</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={[styles.paymentButton, selectedPayment === "stripe" && styles.selectedPayment]}
//                             onPress={() => setSelectedPayment("stripe")}
//                         >
//                             <Text style={styles.paymentText}>Pay with Stripe</Text>
//                         </TouchableOpacity>
//                     </View>
//                     <TouchableOpacity
//                         style={styles.checkoutButton}
//                         onPress={selectedPayment === "stripe" ? handleStripePayment : handleCashPayment}
//                         disabled={!selectedPayment || loading}
//                     >
//                         <Text style={styles.checkoutText}>{loading ? "Processing..." : "Order"}</Text>
//                     </TouchableOpacity>
//                 </>
//             )}
//         </SafeAreaView>
//     );
// };
//
// export default CartScreen;
//
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#659561", padding: 20 },
//     title: { fontSize: 25, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 40 },
//     emptyCart: { fontSize: 18, color: "#fff", textAlign: "center", marginTop: 20 },
//     cartItem: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         borderRadius: 15,
//         padding: 15,
//         marginBottom: 15,
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 4,
//     },
//     image: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
//     details: { flex: 1 },
//     itemName: { fontSize: 18, fontWeight: "bold", color: "#333" },
//     price: { fontSize: 16, color: "#659561", fontWeight: "bold" },
//     quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
//     decrementButton: { backgroundColor: "red", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 },
//     incrementButton: { backgroundColor: "#4CAF50", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 },
//     quantityButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//     quantityText: { marginHorizontal: 10, fontSize: 16, fontWeight: "bold", color: "#333" },
//     totalPrice: { fontSize: 22, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 20 },
//     paymentOptions: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
//     paymentButton: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginHorizontal: 10 },
//     selectedPayment: { backgroundColor: "#4CAF50" },
//     paymentText: { fontSize: 16, fontWeight: "bold", color: "#659561" },
//     checkoutButton: { backgroundColor: "#fff", padding: 15, borderRadius: 30, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
//     checkoutText: { fontSize: 18, fontWeight: "bold", color: "#659561" },
// });


// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useStripe } from "@stripe/stripe-react-native";
// import BackButton from "../components/BackButton";
//
// const CartScreen = () => {
//     const route = useRoute();
//     const navigation = useNavigation();
//     const { initPaymentSheet, presentPaymentSheet } = useStripe();
//     const [cartItems, setCartItems] = useState([]);
//     const [selectedPayment, setSelectedPayment] = useState(null);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         if (route.params?.cartItems) {
//             const updatedCart = route.params.cartItems.map(item => ({
//                 ...item,
//                 quantity: item.quantity ?? 1
//             }));
//             setCartItems(updatedCart);
//             saveCartToStorage(updatedCart);
//         } else {
//             loadCartFromStorage();
//         }
//     }, [route.params]);
//
//     const saveCartToStorage = async (cart) => {
//         try {
//             await AsyncStorage.setItem("cart", JSON.stringify(cart));
//         } catch (error) {
//             console.error("Error saving cart:", error);
//         }
//     };
//
//     const loadCartFromStorage = async () => {
//         try {
//             const storedCart = await AsyncStorage.getItem("cart");
//             if (storedCart) {
//                 const parsed = JSON.parse(storedCart).map(item => ({
//                     ...item,
//                     quantity: item.quantity ?? 1
//                 }));
//                 setCartItems(parsed);
//             }
//         } catch (error) {
//             console.error("Error loading cart:", error);
//         }
//     };
//
//     const removeFromCart = (itemId) => {
//         const updatedCart = cartItems.filter((item) => item.id !== itemId);
//         setCartItems(updatedCart);
//         saveCartToStorage(updatedCart);
//     };
//
//     const incrementQuantity = (itemId) => {
//         const updatedCart = cartItems.map((item) =>
//             item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
//         );
//         setCartItems(updatedCart);
//         saveCartToStorage(updatedCart);
//     };
//
//     const decrementQuantity = (itemId) => {
//         const item = cartItems.find(i => i.id === itemId);
//         if (!item) return;
//
//         if (item.quantity <= 1) {
//             Alert.alert(
//                 "Remove Item",
//                 "Do you want to remove this item from the cart?",
//                 [
//                     { text: "Cancel", style: "cancel" },
//                     {
//                         text: "Remove",
//                         style: "destructive",
//                         onPress: () => {
//                             const updatedCart = cartItems.filter(i => i.id !== itemId);
//                             setCartItems(updatedCart);
//                             saveCartToStorage(updatedCart);
//                         }
//                     }
//                 ]
//             );
//         } else {
//             const updatedCart = cartItems.map((item) =>
//                 item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
//             );
//             setCartItems(updatedCart);
//             saveCartToStorage(updatedCart);
//         }
//     };
//
//     const calculateTotal = () => {
//         return cartItems.reduce((total, item) => {
//             const price = parseFloat(
//                 typeof item.price === "string" ? item.price.replace(/[^0-9.-]+/g, "") : item.price
//             );
//             return total + price * item.quantity;
//         }, 0);
//     };
//
//     const fetchPaymentIntent = async () => {
//         try {
//             const response = await fetch("https://your-backend.com/create-payment-intent", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ amount: calculateTotal() * 100 }),
//             });
//             const { clientSecret } = await response.json();
//             return clientSecret;
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     };
//
//     const createAndNavigateOrder = async () => {
//         const order = {
//             id: Date.now().toString(),
//             items: [...cartItems],
//             total: calculateTotal(),
//             date: new Date().toISOString(),
//         };
//
//         try {
//             const existingOrdersStr = await AsyncStorage.getItem("orders");
//             let existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
//             existingOrders.push(order);
//             await AsyncStorage.setItem("orders", JSON.stringify(existingOrders));
//         } catch (error) {
//             console.error("Error saving order:", error);
//         }
//
//         setCartItems([]);
//         saveCartToStorage([]);
//
//         navigation.reset({
//             index: 1,
//             routes: [
//                 { name: "MainScreen" },
//                 { name: "DeliveryScreen", params: { order } }
//             ],
//         });
//     };
//
//     const handleStripePayment = async () => {
//         setLoading(true);
//         const clientSecret = await fetchPaymentIntent();
//         if (!clientSecret) {
//             setLoading(false);
//             return;
//         }
//
//         const { error } = await initPaymentSheet({ paymentIntentClientSecret: clientSecret });
//         if (!error) {
//             await presentPaymentSheet();
//             Alert.alert("Payment Successful!", "Thank you for your order!");
//             await createAndNavigateOrder();
//         } else {
//             Alert.alert("Payment Failed", "Please try again.");
//         }
//
//         setLoading(false);
//     };
//
//     const handleCashPayment = async () => {
//         Alert.alert("Order Confirmed!", "You have chosen to pay with cash upon delivery.");
//         await createAndNavigateOrder();
//     };
//
//     const renderOrderItem = ({ item }) => (
//         <View style={styles.cartItem}>
//             <Image source={item.image} style={styles.image} />
//             <View style={styles.details}>
//                 <Text style={styles.itemName}>{item.name}</Text>
//                 <Text style={styles.price}>{item.price} x {item.quantity}</Text>
//             </View>
//             <View style={styles.quantityContainer}>
//                 <TouchableOpacity onPress={() => decrementQuantity(item.id)} style={styles.decrementButton}>
//                     <Text style={styles.quantityButtonText}>-</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.quantityText}>{item.quantity}</Text>
//                 <TouchableOpacity onPress={() => incrementQuantity(item.id)} style={styles.incrementButton}>
//                     <Text style={styles.quantityButtonText}>+</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
//
//     return (
//         <SafeAreaView style={styles.container}>
//             <BackButton onPress={() => navigation.goBack()} />
//             <Text style={styles.title}>Your Cart</Text>
//             {cartItems.length === 0 ? (
//                 <Text style={styles.emptyCart}>Your cart is empty!</Text>
//             ) : (
//                 <>
//                     <FlatList
//                         data={cartItems}
//                         keyExtractor={(item) => item.id}
//                         renderItem={renderOrderItem}
//                     />
//                     <Text style={styles.totalPrice}>Total: {calculateTotal().toFixed(2)} ALL</Text>
//                     <View style={styles.paymentOptions}>
//                         <TouchableOpacity
//                             style={[styles.paymentButton, selectedPayment === "cash" && styles.selectedPayment]}
//                             onPress={() => setSelectedPayment("cash")}
//                         >
//                             <Text style={styles.paymentText}>Pay with Cash</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={[styles.paymentButton, selectedPayment === "stripe" && styles.selectedPayment]}
//                             onPress={() => setSelectedPayment("stripe")}
//                         >
//                             <Text style={styles.paymentText}>Pay with Stripe</Text>
//                         </TouchableOpacity>
//                     </View>
//                     <TouchableOpacity
//                         style={styles.checkoutButton}
//                         onPress={selectedPayment === "stripe" ? handleStripePayment : handleCashPayment}
//                         disabled={!selectedPayment || loading}
//                     >
//                         <Text style={styles.checkoutText}>{loading ? "Processing..." : "Order"}</Text>
//                     </TouchableOpacity>
//                 </>
//             )}
//         </SafeAreaView>
//     );
// };
//
// export default CartScreen;
//
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#659561", padding: 20 },
//     title: { fontSize: 25, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 40 },
//     emptyCart: { fontSize: 18, color: "#fff", textAlign: "center", marginTop: 20 },
//     cartItem: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         borderRadius: 15,
//         padding: 15,
//         marginBottom: 15,
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 4,
//     },
//     image: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
//     details: { flex: 1 },
//     itemName: { fontSize: 18, fontWeight: "bold", color: "#333" },
//     price: { fontSize: 16, color: "#659561", fontWeight: "bold" },
//     quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
//     decrementButton: { backgroundColor: "red", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 },
//     incrementButton: { backgroundColor: "#4CAF50", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 },
//     quantityButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//     quantityText: { marginHorizontal: 10, fontSize: 16, fontWeight: "bold", color: "#333" },
//     totalPrice: { fontSize: 22, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 20 },
//     paymentOptions: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
//     paymentButton: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginHorizontal: 10 },
//     selectedPayment: { backgroundColor: "#4CAF50" },
//     paymentText: { fontSize: 16, fontWeight: "bold", color: "#659561" },
//     checkoutButton: {
//         backgroundColor: "#fff",
//         padding: 15,
//         borderRadius: 30,
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         elevation: 5,
//     },
//     checkoutText: { fontSize: 18, fontWeight: "bold", color: "#659561" },
// });
// import React, { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     Image,
//     TouchableOpacity,
//     StyleSheet,
//     SafeAreaView,
//     Alert,
//     ActivityIndicator,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useStripe } from "@stripe/stripe-react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import api, { API_URL } from "../api";
// import BackButton from "../components/BackButton";
//
// const CartScreen = () => {
//     const navigation = useNavigation();
//     const { initPaymentSheet, presentPaymentSheet } = useStripe();
//
//     const [cartItems, setCartItems] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [updatingItemId, setUpdatingItemId] = useState(null);
//     const [selectedPayment, setSelectedPayment] = useState(null);
//     const [paymentLoading, setPaymentLoading] = useState(false);
//
//     // Fetch cart from backend
//     const fetchCart = async () => {
//         setLoading(true);
//         try {
//             const response = await api.get(`${API_URL}/api/cart/`);
//             const data = response.data;
//
//             if (data && data.items) {
//                 const mappedItems = data.items.map((item) => ({
//                     id: item.menuItem._id,
//                     name: item.menuItem.name,
//                     price: item.menuItem.price,
//                     image: item.menuItem.image || null,
//                     quantity: item.quantity,
//                 }));
//                 setCartItems(mappedItems);
//             } else {
//                 setCartItems([]);
//             }
//         } catch (error) {
//             console.error(error.response?.data || error.message);
//             Alert.alert("Error", "Failed to load cart");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         fetchCart();
//     }, []);
//
//     // Increase or decrease quantity by delta
//     const updateQuantity = async (productId, delta) => {
//         const item = cartItems.find((i) => i.id === productId);
//         if (!item) return;
//
//         const newQuantity = item.quantity + delta;
//         if (newQuantity < 1) {
//             Alert.alert(
//                 "Remove Item",
//                 `Remove ${item.name} from the cart?`,
//                 [
//                     { text: "Cancel", style: "cancel" },
//                     { text: "Remove", style: "destructive", onPress: () => removeItem(productId) },
//                 ]
//             );
//             return;
//         }
//
//         setUpdatingItemId(productId);
//         try {
//             await api.post(`${API_URL}/api/cart/add`, {
//                 menuItemId: productId,
//                 quantity: delta,
//             });
//             await fetchCart();
//         } catch (error) {
//             Alert.alert("Error", error.response?.data?.message || "Failed to update cart");
//         } finally {
//             setUpdatingItemId(null);
//         }
//     };
//
//     // Remove item from cart
//     const removeItem = async (productId) => {
//         setUpdatingItemId(productId);
//         try {
//             await api.post(`${API_URL}/api/cart/remove`, { menuItemId: productId });
//             await fetchCart();
//         } catch (error) {
//             Alert.alert("Error", "Failed to remove item from cart");
//         } finally {
//             setUpdatingItemId(null);
//         }
//     };
//
//     // Calculate total price of cart
//     const calculateTotal = () => {
//         return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//     };
//
//     // Fetch payment intent from backend (mock URL, replace with your real backend)
//     const fetchPaymentIntent = async () => {
//         try {
//             const response = await fetch("https://your-backend.com/create-payment-intent", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ amount: calculateTotal() * 100 }),
//             });
//             const { clientSecret } = await response.json();
//             return clientSecret;
//         } catch (error) {
//             console.error("Payment intent error:", error);
//             Alert.alert("Payment Error", "Failed to initiate payment");
//             return null;
//         }
//     };
//
//     // Create order and navigate
//     const createAndNavigateOrder = async () => {
//         const order = {
//             id: Date.now().toString(),
//             items: [...cartItems],
//             total: calculateTotal(),
//             date: new Date().toISOString(),
//         };
//
//         try {
//             const existingOrdersStr = await AsyncStorage.getItem("orders");
//             let existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
//             existingOrders.push(order);
//             await AsyncStorage.setItem("orders", JSON.stringify(existingOrders));
//         } catch (error) {
//             console.error("Error saving order:", error);
//         }
//
//         setCartItems([]);
//
//         navigation.reset({
//             index: 1,
//             routes: [
//                 { name: "MainScreen" },
//                 { name: "DeliveryScreen", params: { order } },
//             ],
//         });
//     };
//
//     // Handle Stripe card payment
//     const handleStripePayment = async () => {
//         setPaymentLoading(true);
//         const clientSecret = await fetchPaymentIntent();
//         if (!clientSecret) {
//             setPaymentLoading(false);
//             return;
//         }
//
//         const { error } = await initPaymentSheet({ paymentIntentClientSecret: clientSecret });
//         if (!error) {
//             const { error: presentError } = await presentPaymentSheet();
//             if (!presentError) {
//                 Alert.alert("Payment Successful!", "Thank you for your order!");
//                 await createAndNavigateOrder();
//             } else {
//                 Alert.alert("Payment Failed", presentError.message);
//             }
//         } else {
//             Alert.alert("Payment Initialization Failed", error.message);
//         }
//         setPaymentLoading(false);
//     };
//
//     // Handle cash payment
//     const handleCashPayment = async () => {
//         Alert.alert("Order Confirmed!", "You have chosen to pay with cash upon delivery.");
//         await createAndNavigateOrder();
//     };
//
//     // Render single cart item row
//     const renderOrderItem = ({ item }) => (
//         <View style={styles.cartItem}>
//             <Image
//                 source={item.image ? { uri: item.image } : require("../assets/profile.png")}
//                 style={styles.image}
//             />
//             <View style={styles.details}>
//                 <Text style={styles.itemName}>{item.name}</Text>
//                 <Text style={styles.price}>
//                     {item.price} x {item.quantity}
//                 </Text>
//             </View>
//             <View style={styles.quantityContainer}>
//                 <TouchableOpacity
//                     onPress={() => updateQuantity(item.id, -1)}
//                     style={styles.quantityButton}
//                     disabled={updatingItemId === item.id}
//                 >
//                     <Text style={styles.quantityButtonText}>-</Text>
//                 </TouchableOpacity>
//
//                 {updatingItemId === item.id ? (
//                     <ActivityIndicator size="small" color="#659561" style={{ marginHorizontal: 10 }} />
//                 ) : (
//                     <Text style={styles.quantityText}>{item.quantity}</Text>
//                 )}
//
//                 <TouchableOpacity
//                     onPress={() => updateQuantity(item.id, 1)}
//                     style={styles.quantityButton}
//                     disabled={updatingItemId === item.id}
//                 >
//                     <Text style={styles.quantityButtonText}>+</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
//
//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator size="large" color="#fff" />
//             </View>
//         );
//     }
//
//     return (
//         <SafeAreaView style={styles.container}>
//             <BackButton onPress={() => navigation.goBack()} />
//             <Text style={styles.title}>Your Cart</Text>
//
//             {cartItems.length === 0 ? (
//                 <Text style={styles.emptyCart}>Your cart is empty!</Text>
//             ) : (
//                 <>
//                     <FlatList
//                         data={cartItems}
//                         keyExtractor={(item) => item.id}
//                         renderItem={renderOrderItem}
//                         contentContainerStyle={{ paddingBottom: 100 }}
//                     />
//                     <Text style={styles.totalPrice}>Total: {calculateTotal().toFixed(2)} ALL</Text>
//
//                     <View style={styles.paymentOptions}>
//                         <TouchableOpacity
//                             style={[styles.paymentButton, selectedPayment === "cash" && styles.selectedPayment]}
//                             onPress={() => setSelectedPayment("cash")}
//                         >
//                             <Text style={styles.paymentButtonText}>Cash</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={[styles.paymentButton, selectedPayment === "card" && styles.selectedPayment]}
//                             onPress={() => setSelectedPayment("card")}
//                         >
//                             <Text style={styles.paymentButtonText}>Card</Text>
//                         </TouchableOpacity>
//                     </View>
//
//                     <TouchableOpacity
//                         disabled={selectedPayment === null || paymentLoading}
//                         onPress={selectedPayment === "card" ? handleStripePayment : handleCashPayment}
//                         style={[
//                             styles.placeOrderButton,
//                             (selectedPayment === null || paymentLoading) && { backgroundColor: "gray" },
//                         ]}
//                     >
//                         {paymentLoading ? (
//                             <ActivityIndicator color="#fff" />
//                         ) : (
//                             <Text style={styles.placeOrderButtonText}>Place Order</Text>
//                         )}
//                     </TouchableOpacity>
//                 </>
//             )}
//         </SafeAreaView>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: "#212121",
//         flex: 1,
//         paddingHorizontal: 16,
//     },
//     center: {
//         flex: 1,
//         backgroundColor: "#212121",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         color: "#fff",
//         marginVertical: 16,
//         textAlign: "center",
//     },
//     emptyCart: {
//         color: "#fff",
//         textAlign: "center",
//         marginTop: 40,
//     },
//     cartItem: {
//         backgroundColor: "#272727",
//         borderRadius: 10,
//         padding: 10,
//         marginBottom: 15,
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     image: {
//         width: 80,
//         height: 80,
//         borderRadius: 10,
//     },
//     details: {
//         flex: 1,
//         marginLeft: 10,
//     },
//     itemName: {
//         fontSize: 18,
//         color: "#fff",
//     },
//     price: {
//         fontSize: 16,
//         color: "#ccc",
//         marginTop: 5,
//     },
//     quantityContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     quantityButton: {
//         backgroundColor: "#659561",
//         borderRadius: 5,
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//     },
//     quantityButtonText: {
//         color: "#fff",
//         fontSize: 20,
//         fontWeight: "bold",
//     },
//     quantityText: {
//         color: "#fff",
//         fontSize: 18,
//         marginHorizontal: 10,
//         minWidth: 20,
//         textAlign: "center",
//     },
//     totalPrice: {
//         fontSize: 20,
//         color: "#fff",
//         fontWeight: "bold",
//         textAlign: "right",
//         marginTop: 10,
//     },
//     paymentOptions: {
//         flexDirection: "row",
//         justifyContent: "space-around",
//         marginVertical: 20,
//     },
//     paymentButton: {
//         backgroundColor: "#333",
//         paddingVertical: 12,
//         paddingHorizontal: 30,
//         borderRadius: 10,
//     },
//     selectedPayment: {
//         backgroundColor: "#659561",
//     },
//     paymentButtonText: {
//         color: "#fff",
//         fontSize: 18,
//     },
//     placeOrderButton: {
//         backgroundColor: "#659561",
//         paddingVertical: 15,
//         borderRadius: 15,
//         alignItems: "center",
//         marginBottom: 20,
//     },
//     placeOrderButtonText: {
//         color: "#fff",
//         fontSize: 20,
//         fontWeight: "bold",
//     },
// });
//
// export default CartScreen;

//
// import React, { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     Image,
//     TouchableOpacity,
//     StyleSheet,
//     SafeAreaView,
//     Alert,
//     ActivityIndicator,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useStripe } from "@stripe/stripe-react-native";
// import api, { API_URL } from "../api";
// import BackButton from "../components/BackButton";
//
// const CartScreen = () => {
//     const navigation = useNavigation();
//     const { initPaymentSheet, presentPaymentSheet } = useStripe();
//
//     const [cartItems, setCartItems] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [updatingItemId, setUpdatingItemId] = useState(null);
//     const [selectedPayment, setSelectedPayment] = useState(null);
//     const [paymentLoading, setPaymentLoading] = useState(false);
//
//     // Fetch cart from backend
//     const fetchCart = async () => {
//         setLoading(true);
//         try {
//             const response = await api.get(`${API_URL}/api/cart/`);
//             const data = response.data;
//
//             if (data && data.items) {
//                 const mappedItems = data.items.map((item) => ({
//                     id: item.menuItem._id,
//                     name: item.menuItem.name,
//                     price: item.menuItem.price,
//                     image: item.menuItem.image || null,
//                     quantity: item.quantity,
//                     restaurantId: item.menuItem.restaurant?._id || null,
//                 }));
//                 setCartItems(mappedItems);
//             } else {
//                 setCartItems([]);
//             }
//         } catch (error) {
//             console.error(error.response?.data || error.message);
//             Alert.alert("Error", "Failed to load cart");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         fetchCart();
//     }, []);
//
//     // Increase or decrease quantity by delta
//     const updateQuantity = async (productId, delta) => {
//         const item = cartItems.find((i) => i.id === productId);
//         if (!item) return;
//
//         const newQuantity = item.quantity + delta;
//         if (newQuantity < 1) {
//             Alert.alert(
//                 "Remove Item",
//                 `Remove ${item.name} from the cart?`,
//                 [
//                     { text: "Cancel", style: "cancel" },
//                     {
//                         text: "Remove",
//                         style: "destructive",
//                         onPress: () => removeItem(productId),
//                     },
//                 ]
//             );
//             return;
//         }
//
//         setUpdatingItemId(productId);
//         try {
//             await api.post(`${API_URL}/api/cart/add`, {
//                 menuItemId: productId,
//                 quantity: delta,
//             });
//             await fetchCart();
//         } catch (error) {
//             Alert.alert("Error", error.response?.data?.message || "Failed to update cart");
//         } finally {
//             setUpdatingItemId(null);
//         }
//     };
//
//     // Remove item from cart
//     const removeItem = async (productId) => {
//         setUpdatingItemId(productId);
//         try {
//             await api.post(`${API_URL}/api/cart/remove`, { menuItemId: productId });
//             await fetchCart();
//         } catch (error) {
//             Alert.alert("Error", "Failed to remove item from cart");
//         } finally {
//             setUpdatingItemId(null);
//         }
//     };
//
//     // Calculate total price of cart
//     const calculateTotal = () => {
//         return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//     };
//
//     // Fetch payment intent from backend
//     const fetchPaymentIntent = async () => {
//         try {
//             const response = await api.post("/api/payment/create-payment-intent", {
//                 amount: Math.round(calculateTotal() * 100),
//             });
//             const { clientSecret } = response.data;
//             return clientSecret;
//         } catch (error) {
//             console.error("Payment intent error:", error);
//             Alert.alert("Payment Error", "Failed to initiate payment");
//             return null;
//         }
//     };
//
//     // Create order on backend
//     const createOrderOnBackend = async () => {
//         if (cartItems.length === 0) {
//             Alert.alert("Cart Empty", "Your cart is empty");
//             return false;
//         }
//
//         // Ensure all items belong to the same restaurant
//         const restaurantId = cartItems[0].restaurantId;
//         const differentRestaurant = cartItems.some((item) => item.restaurantId !== restaurantId);
//         if (differentRestaurant) {
//             Alert.alert("Error", "All items must be from the same restaurant");
//             return false;
//         }
//
//         const payload = {
//             restaurantId,
//             items: cartItems.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
//             paymentMethod: selectedPayment === "cash" ? "cod" : "card",
//         };
//
//         try {
//             await api.post(`${API_URL}/api/orders/create`, payload);
//             // Clear cart after successful order
//             setCartItems([]);
//             await fetchCart();
//             return true;
//         } catch (error) {
//             Alert.alert("Order failed", error.response?.data?.message || "Unknown error");
//             return false;
//         }
//     };
//
//     // Handle Stripe card payment
//     const handleStripePayment = async () => {
//         setPaymentLoading(true);
//         const clientSecret = await fetchPaymentIntent();
//         if (!clientSecret) {
//             setPaymentLoading(false);
//             return;
//         }
//
//         const { error } = await initPaymentSheet({ paymentIntentClientSecret: clientSecret });
//         if (!error) {
//             const { error: presentError } = await presentPaymentSheet();
//             if (!presentError) {
//                 Alert.alert("Payment Successful!", "Thank you for your order!");
//                 const success = await createOrderOnBackend();
//                 if (success) {
//                     navigation.reset({
//                         index: 1,
//                         routes: [{ name: "MainScreen" }, { name: "DeliveryScreen" }],
//                     });
//                 }
//             } else {
//                 Alert.alert("Payment Failed", presentError.message);
//             }
//         } else {
//             Alert.alert("Payment Initialization Failed", error.message);
//         }
//         setPaymentLoading(false);
//     };
//
//     // Handle cash payment
//     const handleCashPayment = async () => {
//         Alert.alert("Order Confirmed!", "You have chosen to pay with cash upon delivery.");
//         const success = await createOrderOnBackend();
//         if (success) {
//             navigation.reset({
//                 index: 1,
//                 routes: [{ name: "MainScreen" }, { name: "DeliveryScreen" }],
//             });
//         }
//     };
//
//     // Render single cart item row
//     const renderOrderItem = ({ item }) => (
//         <View style={styles.cartItem}>
//             <Image
//                 source={item.image ? { uri: item.image } : require("../assets/profile.png")}
//                 style={styles.image}
//             />
//             <View style={styles.details}>
//                 <Text style={styles.itemName}>{item.name}</Text>
//                 <Text style={styles.price}>
//                     {item.price} x {item.quantity}
//                 </Text>
//             </View>
//             <View style={styles.quantityContainer}>
//                 <TouchableOpacity
//                     onPress={() => updateQuantity(item.id, -1)}
//                     style={styles.quantityButton}
//                     disabled={updatingItemId === item.id}
//                 >
//                     <Text style={styles.quantityButtonText}>-</Text>
//                 </TouchableOpacity>
//
//                 {updatingItemId === item.id ? (
//                     <ActivityIndicator size="small" color="#659561" style={{ marginHorizontal: 10 }} />
//                 ) : (
//                     <Text style={styles.quantityText}>{item.quantity}</Text>
//                 )}
//
//                 <TouchableOpacity
//                     onPress={() => updateQuantity(item.id, 1)}
//                     style={styles.quantityButton}
//                     disabled={updatingItemId === item.id}
//                 >
//                     <Text style={styles.quantityButtonText}>+</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
//
//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator size="large" color="#fff" />
//             </View>
//         );
//     }
//
//     return (
//         <SafeAreaView style={styles.container}>
//             <BackButton onPress={() => navigation.goBack()} />
//             <Text style={styles.title}>Your Cart</Text>
//
//             {cartItems.length === 0 ? (
//                 <Text style={styles.emptyCart}>Your cart is empty!</Text>
//             ) : (
//                 <KeyboardAvoidingView
//                     behavior={Platform.OS === "ios" ? "padding" : "height"}
//                     style={{ flex: 1 }}
//                 >
//                     <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
//                         <FlatList
//                             data={cartItems}
//                             keyExtractor={(item) => item.id}
//                             renderItem={renderOrderItem}
//                             scrollEnabled={false}
//                         />
//
//                         <Text style={styles.totalPrice}>Total: {calculateTotal().toFixed(2)} ALL</Text>
//
//                         <Text style={styles.label}>Select Payment Method:</Text>
//                         <View style={styles.paymentMethods}>
//                             <TouchableOpacity
//                                 style={[
//                                     styles.paymentButton,
//                                     selectedPayment === "card" && styles.paymentButtonSelected,
//                                 ]}
//                                 onPress={() => setSelectedPayment("card")}
//                             >
//                                 <Text style={styles.paymentButtonText}>Card</Text>
//                             </TouchableOpacity>
//
//                             <TouchableOpacity
//                                 style={[
//                                     styles.paymentButton,
//                                     selectedPayment === "cash" && styles.paymentButtonSelected,
//                                 ]}
//                                 onPress={() => setSelectedPayment("cash")}
//                             >
//                                 <Text style={styles.paymentButtonText}>Cash</Text>
//                             </TouchableOpacity>
//                         </View>
//
//                         <TouchableOpacity
//                             style={[
//                                 styles.checkoutButton,
//                                 (!selectedPayment || paymentLoading) && styles.checkoutButtonDisabled,
//                             ]}
//                             disabled={!selectedPayment || paymentLoading}
//                             onPress={() =>
//                                 selectedPayment === "card" ? handleStripePayment() : handleCashPayment()
//                             }
//                         >
//                             {paymentLoading ? (
//                                 <ActivityIndicator color="#fff" />
//                             ) : (
//                                 <Text style={styles.checkoutButtonText}>Place Order</Text>
//                             )}
//                         </TouchableOpacity>
//                     </ScrollView>
//                 </KeyboardAvoidingView>
//             )}
//         </SafeAreaView>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#262626",
//         paddingHorizontal: 16,
//         paddingTop: 30,
//     },
//     center: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#262626",
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         color: "#fff",
//         marginBottom: 20,
//     },
//     emptyCart: {
//         color: "#fff",
//         fontSize: 18,
//         textAlign: "center",
//         marginTop: 40,
//     },
//     cartItem: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: 15,
//         backgroundColor: "#333",
//         borderRadius: 8,
//         padding: 10,
//     },
//     image: {
//         width: 80,
//         height: 80,
//         borderRadius: 10,
//     },
//     details: {
//         flex: 1,
//         marginLeft: 10,
//     },
//     itemName: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#fff",
//     },
//     price: {
//         fontSize: 16,
//         color: "#bbb",
//         marginTop: 5,
//     },
//     quantityContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     quantityButton: {
//         backgroundColor: "#659561",
//         borderRadius: 5,
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//     },
//     quantityButtonText: {
//         fontSize: 20,
//         fontWeight: "bold",
//         color: "#fff",
//     },
//     quantityText: {
//         marginHorizontal: 10,
//         fontSize: 18,
//         color: "#fff",
//     },
//     totalPrice: {
//         fontSize: 20,
//         fontWeight: "bold",
//         color: "#fff",
//         marginTop: 15,
//         marginBottom: 20,
//         textAlign: "right",
//     },
//     label: {
//         color: "#ccc",
//         fontSize: 16,
//         marginBottom: 6,
//         marginTop: 10,
//     },
//     paymentMethods: {
//         flexDirection: "row",
//         marginTop: 10,
//         marginBottom: 20,
//     },
//     paymentButton: {
//         flex: 1,
//         backgroundColor: "#444",
//         borderRadius: 8,
//         padding: 12,
//         marginHorizontal: 5,
//         alignItems: "center",
//     },
//     paymentButtonSelected: {
//         backgroundColor: "#659561",
//     },
//     paymentButtonText: {
//         color: "#fff",
//         fontSize: 16,
//     },
//     checkoutButton: {
//         backgroundColor: "#659561",
//         paddingVertical: 15,
//         borderRadius: 8,
//         alignItems: "center",
//         marginBottom: 30,
//     },
//     checkoutButtonDisabled: {
//         backgroundColor: "#4a6f43",
//     },
//     checkoutButtonText: {
//         color: "#fff",
//         fontSize: 18,
//         fontWeight: "bold",
//     },
// });
//
// export default CartScreen;



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
    const createAndNavigateOrder = async () => {
        const order = {
            id: Date.now().toString(),
            items: [...cartItems],
            total: calculateTotal(),
            date: new Date().toISOString(),
        };

        try {
            // Save order locally, or replace this with backend call if you want
            const existingOrdersStr = await AsyncStorage.getItem("orders");
            let existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
            existingOrders.push(order);
            await AsyncStorage.setItem("orders", JSON.stringify(existingOrders));
        } catch (error) {
            console.error("Error saving order:", error);
        }

        setCartItems([]);

        // Navigate to DeliveryScreen with order details
        navigation.reset({
            index: 1,
            routes: [
                { name: "MainScreen" }, // optional, your main/home screen
                { name: "DeliveryScreen", params: { order } },
            ],
        });
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
