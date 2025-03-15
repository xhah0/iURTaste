import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const pastaMenu = [
    { id: "1", name: "Spaghetti Carbonara - 700 L" },
    { id: "2", name: "Penne Arrabbiata - 600 L" },
    { id: "3", name: "Truffle Tagliatelle - 900 L" },
    { id: "4", name: "Seafood Linguine - 950 L" },
];

const PastaMenuScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Artigiano - Pasta Menu</Text>
            <FlatList
                data={pastaMenu}
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

export default PastaMenuScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#659561", padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    menuItem: { backgroundColor: "#fff", padding: 12, marginVertical: 5, borderRadius: 8 },
    menuText: { fontSize: 18, color: "#659561", fontWeight: "bold" },
});