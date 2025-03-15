import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

const CartScreen = () => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

    const fetchPaymentIntent = async () => {
        try {
            const response = await fetch("https://your-backend.com/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 2000 }), // Example: $20
            });
            const { clientSecret } = await response.json();
            return clientSecret;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        const clientSecret = await fetchPaymentIntent();
        if (!clientSecret) return;
        const { error } = await initPaymentSheet({ paymentIntentClientSecret: clientSecret });
        if (!error) await presentPaymentSheet();
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Cart</Text>
            <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
                <Text style={styles.payText}>{loading ? "Processing..." : "Checkout with Stripe"}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#659561" },
    title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    payButton: { backgroundColor: "#fff", padding: 12, borderRadius: 10 },
    payText: { fontSize: 18, fontWeight: "bold", color: "#659561" },
});
