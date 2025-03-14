import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackButton from '../components/BackButton';

const CartScreen = () => {
    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.title}>Your Cart</Text>
            <Text style={styles.info}>Your cart is currently empty.</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Browse Restaurants!</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CartScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#659561',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    info: {
        fontSize: 16,
        color: '#ddd',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 10,
        borderRadius: 30,
        width: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
