import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const burgerMenu = [
    { id: "1", name: "Classic Cheeseburger - 500 L" },
    { id: "2", name: "Mullixhiu Special Burger - 700 L" },
    { id: "3", name: "Double Patty Burger - 800 L" },
    { id: "4", name: "Vegan Burger - 600 L" },
];

const BurgerMenuScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mullixhiu - Burger Menu</Text>
            <FlatList
                data={burgerMenu}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default BurgerMenuScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#659561", padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    menuItem: { backgroundColor: "#fff", padding: 12, marginVertical: 5, borderRadius: 8 },
    menuText: { fontSize: 18, color: "#659561", fontWeight: "bold" },
});