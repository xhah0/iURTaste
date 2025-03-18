import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({ onPress }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={onPress || navigation.goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
    );
};

export default BackButton;

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: 50,  // Adjusted to fit properly
        left: 15,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: 10,
        borderRadius: 50,
    },
});
