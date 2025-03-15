import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const sushiMenu = [
    { id: "1", name: "Salmon Sashimi - 800 L" },
    { id: "2", name: "California Roll - 750 L" },
    { id: "3", name: "Dragon Roll - 900 L" },
    { id: "4", name: "Tuna Nigiri - 850 L" },
];

const SushiMenuScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SushiCo Tirana - Sushi Menu</Text>
            <FlatList
                data={sushiMenu}
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

export default SushiMenuScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#659561", padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    menuItem: { backgroundColor: "#fff", padding: 12, marginVertical: 5, borderRadius: 8 },
    menuText: { fontSize: 18, color: "#659561", fontWeight: "bold" },
});