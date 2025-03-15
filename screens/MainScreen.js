import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Platform, Pressable, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import burgerImage from "../assets/burger.jpg";
import Artigiano from "../assets/Artigiano.jpg";
import SushiCo from "../assets/SushiCo.jpg";
import proper from "../assets/proper.jpg"
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

    const handleLogout = () => {
        navigation.replace('LoginScreen');
    };

    const handleMenuToggle = () => {
        setMenuVisible(!menuVisible);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    const navigateToProfile = () => {
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
            <View style={styles.header}>
                <TouchableOpacity onPress={handleMenuToggle}>
                    <Ionicons name="menu" size={30} color="#fff" style={styles.menuIcon} />
                </TouchableOpacity>
                <Image source={require('../assets/Logo.png')} style={styles.logo} />
                <TouchableOpacity onPress={navigateToProfile} style={styles.profileIcon}>
                    <Ionicons name="person-circle-outline" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            <Modal visible={menuVisible} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={closeMenu}>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuItem} onPress={navigateToFavorites}>
                            <Text style={styles.menuText}>Favorites</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={navigateToCart}>
                            <Text style={styles.menuText}>Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                            <Text style={[styles.menuText, { color: 'red' }]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            <View style={styles.content}>
                <Text style={styles.welcome}>Restaurants</Text>
                <FlatList
                    data={restaurants}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.restaurantCard} onPress={() => navigation.navigate(item.menu)}>
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: '#659561',
        justifyContent: 'space-between',
    },
    menuIcon: {
        marginRight: 10,
    },
    profileIcon: {
        padding: 5,
    },
    logo: {
        width: 120,
        height: 50,
        resizeMode: 'contain',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menuContainer: {
        position: 'absolute',
        top: 90,
        left: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        elevation: 5,
    },
    menuItem: {
        padding: 10,
    },
    menuText: {
        color: '#659561',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    welcome: {
        fontSize: 28,
        marginBottom: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    row: {
        justifyContent: 'space-between',
    },
    restaurantCard: {
        backgroundColor: "#fff",
        padding: 15,
        margin: 10,
        borderRadius: 15,
        alignItems: "center",
        width: '45%',
        elevation: 5,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#659561",
        marginTop: 10,
        textAlign: 'center',
    },
});
