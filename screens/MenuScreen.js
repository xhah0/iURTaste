import React, { useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { menus } from "./menus";
import BackButton from "../components/BackButton";

const MenuScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { restaurantName } = route.params;
    const menuItems = menus[restaurantName] || [];

    // State to track selected item quantities
    const [cart, setCart] = useState({});

    // Add item to cart
    const addToCart = (item) => {
        setCart((prevCart) => ({
            ...prevCart,
            [item.id]: { ...item, quantity: (prevCart[item.id]?.quantity || 0) + 1 },
        }));
    };

    // Remove item from cart (using an immutable update)
    const removeFromCart = (itemId) => {
        setCart((prevCart) => {
            if (!prevCart[itemId]) return prevCart;
            const currentItem = prevCart[itemId];
            if (currentItem.quantity > 1) {
                return {
                    ...prevCart,
                    [itemId]: { ...currentItem, quantity: currentItem.quantity - 1 },
                };
            } else {
                const updatedCart = { ...prevCart };
                delete updatedCart[itemId];
                return updatedCart;
            }
        });
    };

    // Navigate to CartScreen with selected items
    const handleGoToCart = () => {
        navigation.navigate("CartScreen", { cartItems: Object.values(cart) });
    };

    // Get total items count
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

    // Get total price (ensure item.price is converted correctly)
    const totalPrice = Object.values(cart).reduce((sum, item) => {
        const price = parseFloat(
            typeof item.price === "string" ? item.price.replace(/[^0-9.-]+/g, "") : item.price
        );
        return sum + (price * item.quantity);
    }, 0).toFixed(2);

    return (
        <SafeAreaView style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={styles.title}>{restaurantName} Menu</Text>
            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.menuItem}>
                        <Image source={item.image} style={styles.image} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.price}>{item.price}</Text>
                        </View>
                        <View style={styles.cartControls}>
                            <TouchableOpacity style={styles.cartButton} onPress={() => removeFromCart(item.id)}>
                                <Text style={styles.cartButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.itemCount}>{cart[item.id]?.quantity || 0}</Text>
                            <TouchableOpacity style={styles.cartButton} onPress={() => addToCart(item)}>
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
                        <Text style={styles.cartTotalText}> {totalPrice}ALL</Text>
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
