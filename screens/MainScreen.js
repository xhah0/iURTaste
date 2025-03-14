import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Platform, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
                <Text style={styles.welcome}>Restorantet</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 28,
        marginBottom: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
});
