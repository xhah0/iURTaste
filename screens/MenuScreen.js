// import React, { useState } from "react";
// import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { menus } from "./menus";
// import BackButton from "../components/BackButton";
//
// const MenuScreen = () => {
//     const route = useRoute();
//     const navigation = useNavigation();
//     const { restaurantName } = route.params;
//     const menuItems = menus[restaurantName] || [];
//
//     // State to track selected item quantities
//     const [cart, setCart] = useState({});
//
//     // Add item to cart
//     const addToCart = (item) => {
//         setCart((prevCart) => ({
//             ...prevCart,
//             [item.id]: { ...item, quantity: (prevCart[item.id]?.quantity || 0) + 1 },
//         }));
//     };
//
//     // Remove item from cart (using an immutable update)
//     const removeFromCart = (itemId) => {
//         setCart((prevCart) => {
//             if (!prevCart[itemId]) return prevCart;
//             const currentItem = prevCart[itemId];
//             if (currentItem.quantity > 1) {
//                 return {
//                     ...prevCart,
//                     [itemId]: { ...currentItem, quantity: currentItem.quantity - 1 },
//                 };
//             } else {
//                 const updatedCart = { ...prevCart };
//                 delete updatedCart[itemId];
//                 return updatedCart;
//             }
//         });
//     };
//
//     // Navigate to CartScreen with selected items
//     const handleGoToCart = () => {
//         navigation.navigate("CartScreen", { cartItems: Object.values(cart) });
//     };
//
//     // Get total items count
//     const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
//
//     // Get total price (ensure item.price is converted correctly)
//     const totalPrice = Object.values(cart).reduce((sum, item) => {
//         const price = parseFloat(
//             typeof item.price === "string" ? item.price.replace(/[^0-9.-]+/g, "") : item.price
//         );
//         return sum + (price * item.quantity);
//     }, 0).toFixed(2);
//
//     return (
//         <SafeAreaView style={styles.container}>
//             <BackButton onPress={() => navigation.goBack()} />
//             <Text style={styles.title}>{restaurantName} Menu</Text>
//             <FlatList
//                 data={menuItems}
//                 keyExtractor={(item) => item.id}
//                 contentContainerStyle={styles.listContainer}
//                 renderItem={({ item }) => (
//                     <View style={styles.menuItem}>
//                         <Image source={item.image} style={styles.image} />
//                         <View style={styles.itemDetails}>
//                             <Text style={styles.itemName}>{item.name}</Text>
//                             <Text style={styles.price}>{item.price}</Text>
//                         </View>
//                         <View style={styles.cartControls}>
//                             <TouchableOpacity style={styles.cartButton} onPress={() => removeFromCart(item.id)}>
//                                 <Text style={styles.cartButtonText}>-</Text>
//                             </TouchableOpacity>
//                             <Text style={styles.itemCount}>{cart[item.id]?.quantity || 0}</Text>
//                             <TouchableOpacity style={styles.cartButton} onPress={() => addToCart(item)}>
//                                 <Text style={styles.cartButtonText}>+</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 )}
//             />
//             {totalItems > 0 && (
//                 <TouchableOpacity style={styles.cartFloatingButton} onPress={handleGoToCart}>
//                     <View style={styles.cartInfo}>
//                         <Text style={styles.cartIconText}>🛒 {totalItems} Items</Text>
//                         <Text style={styles.cartTotalText}> {totalPrice}ALL</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}
//         </SafeAreaView>
//     );
// };
//
// export default MenuScreen;
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#659561",
//         padding: 20,
//     },
//     title: {
//         fontSize: 25,
//         fontWeight: "bold",
//         color: "#fff",
//         textAlign: "center",
//         marginBottom: 30,
//         marginTop: 13,
//     },
//     listContainer: {
//         paddingBottom: 100,
//     },
//     menuItem: {
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
//     image: {
//         width: 90,
//         height: 90,
//         borderRadius: 10,
//         marginRight: 15,
//     },
//     itemDetails: {
//         flex: 1,
//     },
//     itemName: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#333",
//         marginBottom: 5,
//     },
//     price: {
//         fontSize: 16,
//         color: "#659561",
//         fontWeight: "bold",
//     },
//     cartControls: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     cartButton: {
//         backgroundColor: "#659561",
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//         borderRadius: 8,
//         marginHorizontal: 5,
//     },
//     cartButtonText: {
//         fontSize: 18,
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     itemCount: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#333",
//         minWidth: 30,
//         textAlign: "center",
//     },
//     cartFloatingButton: {
//         position: "absolute",
//         bottom: 20,
//         left: 20,
//         right: 20,
//         backgroundColor: "#fff",
//         paddingVertical: 15,
//         paddingHorizontal: 20,
//         borderRadius: 30,
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         elevation: 5,
//     },
//     cartInfo: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         width: "100%",
//     },
//     cartIconText: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#659561",
//     },
//     cartTotalText: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#659561",
//     },
// });

// import React, { useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     Image,
//     StyleSheet,
//     SafeAreaView,
//     TouchableOpacity,
//     ActivityIndicator,
//     Alert,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import BackButton from "../components/BackButton";
// import { API_URL } from "../api";
//
// const MenuScreen = () => {
//     const route = useRoute();
//     const navigation = useNavigation();
//     const { restaurantId, restaurantName } = route.params;
//
//     const [menuItems, setMenuItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [cart, setCart] = useState({});
//
//     const fetchMenuItems = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${API_URL}/api/restaurants/${restaurantId}`);
//             if (!response.ok) {
//                 console.log('Fetch failed with status:', response.status);
//                 throw new Error("Failed to fetch menu items");
//             }
//             const data = await response.json();
//             setMenuItems(data); // assuming data is an array
//         } catch (error) {
//             console.error('Error fetching menu items:', error);
//             Alert.alert("Error", "Could not load menu items. Please try again later.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         fetchMenuItems();
//     }, [restaurantId]);
//
//     const addToCart = (item) => {
//         setCart((prevCart) => ({
//             ...prevCart,
//             [item._id]: { ...item, quantity: (prevCart[item._id]?.quantity || 0) + 1 },
//         }));
//     };
//
//     const removeFromCart = (itemId) => {
//         setCart((prevCart) => {
//             if (!prevCart[itemId]) return prevCart;
//             const currentItem = prevCart[itemId];
//             if (currentItem.quantity > 1) {
//                 return {
//                     ...prevCart,
//                     [itemId]: { ...currentItem, quantity: currentItem.quantity - 1 },
//                 };
//             } else {
//                 const updatedCart = { ...prevCart };
//                 delete updatedCart[itemId];
//                 return updatedCart;
//             }
//         });
//     };
//
//     const handleGoToCart = () => {
//         navigation.navigate("CartScreen", { cartItems: Object.values(cart) });
//     };
//
//     const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
//     const totalPrice = Object.values(cart)
//         .reduce((sum, item) => sum + item.price * item.quantity, 0)
//         .toFixed(2);
//
//     if (loading) {
//         return (
//             <SafeAreaView style={styles.container}>
//                 <BackButton onPress={() => navigation.goBack()} />
//                 <ActivityIndicator size="large" color="#659561" />
//             </SafeAreaView>
//         );
//     }
//
//     return (
//         <SafeAreaView style={styles.container}>
//             <BackButton onPress={() => navigation.goBack()} />
//             <Text style={styles.title}>{restaurantName} Menu</Text>
//             <FlatList
//                 data={menuItems}
//                 keyExtractor={(item) => item._id}
//                 contentContainerStyle={styles.listContainer}
//                 renderItem={({ item }) => (
//                     <View style={styles.menuItem}>
//                         {item.image ? (
//                             <Image source={{ uri: item.image }} style={styles.image} />
//                         ) : (
//                             <View style={[styles.image, { backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" }]}>
//                                 <Text>No Image</Text>
//                             </View>
//                         )}
//                         <View style={styles.itemDetails}>
//                             <Text style={styles.itemName}>{item.name}</Text>
//                             <Text style={styles.price}>{item.price.toFixed(2)} ALL</Text>
//                             {item.description ? (
//                                 <Text style={styles.description}>{item.description}</Text>
//                             ) : null}
//                         </View>
//                         <View style={styles.cartControls}>
//                             <TouchableOpacity style={styles.cartButton} onPress={() => removeFromCart(item._id)}>
//                                 <Text style={styles.cartButtonText}>-</Text>
//                             </TouchableOpacity>
//                             <Text style={styles.itemCount}>{cart[item._id]?.quantity || 0}</Text>
//                             <TouchableOpacity style={styles.cartButton} onPress={() => addToCart(item)}>
//                                 <Text style={styles.cartButtonText}>+</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 )}
//             />
//             {totalItems > 0 && (
//                 <TouchableOpacity style={styles.cartFloatingButton} onPress={handleGoToCart}>
//                     <View style={styles.cartInfo}>
//                         <Text style={styles.cartIconText}>🛒 {totalItems} Items</Text>
//                         <Text style={styles.cartTotalText}> {totalPrice} ALL</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}
//         </SafeAreaView>
//     );
// };
//
// export default MenuScreen;
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#659561",
//         padding: 20,
//     },
//     title: {
//         fontSize: 25,
//         fontWeight: "bold",
//         color: "#fff",
//         textAlign: "center",
//         marginBottom: 30,
//         marginTop: 13,
//     },
//     listContainer: {
//         paddingBottom: 100,
//     },
//     menuItem: {
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
//     image: {
//         width: 90,
//         height: 90,
//         borderRadius: 10,
//         marginRight: 15,
//     },
//     itemDetails: {
//         flex: 1,
//     },
//     itemName: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#333",
//         marginBottom: 5,
//     },
//     description: {
//         fontSize: 14,
//         color: "#555",
//     },
//     price: {
//         fontSize: 16,
//         color: "#659561",
//         fontWeight: "bold",
//     },
//     cartControls: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     cartButton: {
//         backgroundColor: "#659561",
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//         borderRadius: 8,
//         marginHorizontal: 5,
//     },
//     cartButtonText: {
//         fontSize: 18,
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     itemCount: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#333",
//         minWidth: 30,
//         textAlign: "center",
//     },
//     cartFloatingButton: {
//         position: "absolute",
//         bottom: 20,
//         left: 20,
//         right: 20,
//         backgroundColor: "#fff",
//         paddingVertical: 15,
//         paddingHorizontal: 20,
//         borderRadius: 30,
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         elevation: 5,
//     },
//     cartInfo: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         width: "100%",
//     },
//     cartIconText: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#659561",
//     },
//     cartTotalText: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#659561",
//     },
// });

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import { API_URL } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MenuScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { restaurantId, restaurantName } = route.params;

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState({});
    const [syncing, setSyncing] = useState(false);

    // Dummy function to get user token, replace with your auth logic
    const getUserToken = async () => {
        try {
            // For example, token stored in AsyncStorage:
            const token = await AsyncStorage.getItem('userToken');
            return token;
        } catch (error) {
            console.error("Error fetching user token:", error);
            return null;
        }
    };

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/restaurants/${restaurantId}`);
            if (!response.ok) {
                console.log('Fetch failed with status:', response.status);
                throw new Error("Failed to fetch menu items");
            }
            const data = await response.json();
            setMenuItems(data); // assuming data is an array
        } catch (error) {
            console.error('Error fetching menu items:', error);
            Alert.alert("Error", "Could not load menu items. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem('cart');
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error("Error loading cart from storage:", error);
        }
    };

    const saveCart = async (updatedCart) => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        } catch (error) {
            console.error("Error saving cart to storage:", error);
        }
    };

    useEffect(() => {
        fetchMenuItems();
        loadCart();
    }, [restaurantId]);

    useEffect(() => {
        saveCart(cart);
    }, [cart]);

    const addToCart = (item) => {
        const updatedCart = {
            ...cart,
            [item._id]: { ...item, quantity: (cart[item._id]?.quantity || 0) + 1 },
        };
        setCart(updatedCart);
    };

    const removeFromCart = (itemId) => {
        if (!cart[itemId]) return;

        const currentItem = cart[itemId];
        const updatedCart = { ...cart };

        if (currentItem.quantity > 1) {
            updatedCart[itemId] = { ...currentItem, quantity: currentItem.quantity - 1 };
        } else {
            delete updatedCart[itemId];
        }

        setCart(updatedCart);
    };

    const handleGoToCart = async () => {
        if (Object.keys(cart).length === 0) {
            Alert.alert("Cart is empty", "Please add items to the cart before proceeding.");
            return;
        }

        setSyncing(true);
        try {
            const userToken = await getUserToken();
            if (!userToken) {
                Alert.alert("Authentication error", "Please login to continue.");
                setSyncing(false);
                return;
            }

            // Prepare payload for backend
            const cartItems = Object.values(cart).map(item => ({
                menuItemId: item._id,
                quantity: item.quantity,
            }));

            const response = await fetch(`${API_URL}/api/cart/sync`, {
                method: "POST", // Or PUT depending on your API
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({ items: cartItems }),
            });

            if (!response.ok) {
                throw new Error("Failed to sync cart with server");
            }

            // Optional: get updated cart from response if your API returns it
            // const syncedCart = await response.json();

            setSyncing(false);
            // Navigate to CartScreen, passing local cart items or refetch in CartScreen
            navigation.navigate("CartScreen", { cartItems: Object.values(cart) });

        } catch (error) {
            setSyncing(false);
            console.error("Cart sync error:", error);
            Alert.alert("Error", "Could not sync cart. Please try again.");
        }
    };

    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = Object.values(cart)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);

    if (loading || syncing) {
        return (
            <SafeAreaView style={styles.container}>
                <BackButton onPress={() => navigation.goBack()} />
                <ActivityIndicator size="large" color="#659561" />
                <Text style={{ textAlign: "center", marginTop: 10 }}>
                    {syncing ? "Syncing cart..." : "Loading menu..."}
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={styles.title}>{restaurantName} Menu</Text>
            <FlatList
                data={menuItems}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.menuItem}>
                        {item.image ? (
                            <Image source={{ uri: item.image }} style={styles.image} />
                        ) : (
                            <View
                                style={[
                                    styles.image,
                                    {
                                        backgroundColor: "#ccc",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    },
                                ]}
                            >
                                <Text>No Image</Text>
                            </View>
                        )}
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.price}>{item.price.toFixed(2)} ALL</Text>
                            {item.description ? (
                                <Text style={styles.description}>{item.description}</Text>
                            ) : null}
                        </View>
                        <View style={styles.cartControls}>
                            <TouchableOpacity
                                style={styles.cartButton}
                                onPress={() => removeFromCart(item._id)}
                            >
                                <Text style={styles.cartButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.itemCount}>{cart[item._id]?.quantity || 0}</Text>
                            <TouchableOpacity
                                style={styles.cartButton}
                                onPress={() => addToCart(item)}
                            >
                                <Text style={styles.cartButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            {totalItems > 0 && (
                <TouchableOpacity style={styles.cartFloatingButton} onPress={handleGoToCart}>
                    <View style={styles.cartInfo}>
                        <Text style={styles.cartIconText}>🛒 {totalItems} Items</Text>
                        <Text style={styles.cartTotalText}> {totalPrice} ALL</Text>
                    </View>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default MenuScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#659561",
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 30,
        marginTop: 13,
    },
    listContainer: {
        paddingBottom: 100,
    },
    menuItem: {
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
    image: {
        width: 90,
        height: 90,
        borderRadius: 10,
        marginRight: 15,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: "#555",
    },
    price: {
        fontSize: 16,
        color: "#659561",
        fontWeight: "bold",
    },
    cartControls: {
        flexDirection: "row",
        alignItems: "center",
    },
    cartButton: {
        backgroundColor: "#659561",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    cartButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    itemCount: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        minWidth: 30,
        textAlign: "center",
    },
    cartFloatingButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    cartInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    cartIconText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#659561",
    },
    cartTotalText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#659561",
    },
});
