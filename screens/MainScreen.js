import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Platform, Pressable, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import burgerImage from "../assets/burger.jpg";
import Artigiano from "../assets/Artigiano.jpg";
import SushiCo from "../assets/SushiCo.jpg";
import proper from "../assets/proper.jpg";
import Serendipity from "../assets/Serendipity.jpg";
import King from "../assets/King.png";
import Pastaria from "../assets/Pastaria.jpg";
import hebs from "../assets/Hebs.webp";
import KFC from "../assets/KFC.png";
import Phut from "../assets/PHUT.png";

const restaurants = [
    { id: "1", name: "SmashBurger", image: burgerImage, menu: "BurgerMenuScreen"},
    { id: "2", name: "Artigiano", image: Artigiano, menu: "PastaMenuScreen" },
    { id: "3", name: "SushiCo Tirana", image: SushiCo, menu: "SushiMenuScreen" },
    { id: "4", name: "Proper Pizza", image: proper, menu: "BurgerMenuScreen" },
    { id: "5", name: "Serendipity Tirana", image: Serendipity, menu: "PastaMenuScreen" },
    { id: "6", name: "Burger King", image: King, menu: "BurgerMenuScreen" },
    { id: "7", name: "Pastaria", image: Pastaria, menu: "BurgerMenuScreen" },
    { id: "8", name: "Hebs Tirana", image: hebs, menu: "PastaMenuScreen" },
    { id: "9", name: "KFC", image: KFC, menu: "BurgerMenuScreen" },
    { id: "10", name: "Pizza Hut", image: Phut, menu: "PastaMenuScreen" },
];

const MainScreen = () => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleMenuToggle = () => setMenuVisible(!menuVisible);
    const closeMenu = () => setMenuVisible(false);

    const navigateToProfile = () => {
        closeMenu();
        navigation.navigate('ProfileScreen');
    };

    const navigateToFavorites = () => {
        closeMenu();
        navigation.navigate('FavoritesScreen');
    };

    const navigateToCart = () => {
        closeMenu();
        navigation.navigate('CartScreen');
    };

    return (
        <View style={styles.container}>
            {/* Top Taskbar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleMenuToggle}>
                    <Ionicons name="menu" size={30} color="#fff" style={styles.menuIcon} />
                </TouchableOpacity>
                <Image source={require('../assets/Logo.png')} style={styles.logo} />
                <TouchableOpacity onPress={navigateToProfile} style={styles.profileIcon}>
                    <Ionicons name="person-circle-outline" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Sandwich Menu (Taskbar) */}
            <Modal visible={menuVisible} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={closeMenu}>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuItem} onPress={navigateToFavorites}>
                            <Text style={styles.menuText}>Favorites</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={navigateToCart}>
                            <Text style={styles.menuText}>Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.replace('LoginScreen')}>
                            <Text style={[styles.menuText, { color: 'red' }]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* Restaurants List */}
            <View style={styles.content}>
                <Text style={styles.welcome}>Restaurants</Text>
                <FlatList
                    data={restaurants}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.restaurantCard}
                            onPress={() => navigation.navigate("MenuScreen", { restaurantName: item.name })}
                        >
                            <Image source={item.image} style={styles.image} />
                            <Text style={styles.restaurantName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
};

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#659561',
        paddingTop: Platform.OS === 'ios' ? 45 : 25, // Adjust for status bar spacing
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#659561',
        justifyContent: 'space-between',
    },
    menuIcon: { marginLeft: 10 },
    profileIcon: { marginRight: 10 },
    logo: { width: 100, height: 40, resizeMode: 'contain' },

    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    menuContainer: {
        position: 'absolute',
        top: 80,
        left: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        elevation: 5
    },
    menuItem: { padding: 10 },
    menuText: { color: '#659561', fontWeight: 'bold' },

    content: {
        flex: 1,
        alignItems: 'center',
        padding: 5,
    },
    welcome: {
        fontSize: 24,
        marginBottom: 15,
        color: '#fff',
        fontWeight: 'bold'
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    restaurantCard: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: 12,
        margin: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFF',
        alignItems: "center",
        width: '47%',
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#659561",
        marginTop: 8,
        textAlign: 'center'
    },
});
