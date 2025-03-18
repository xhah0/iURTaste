import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StripeProvider } from '@stripe/stripe-react-native'; // ✅ Import Stripe once
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import CartScreen from './screens/CartScreen';
import MenuScreen from './screens/MenuScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <StripeProvider publishableKey="pk_test_your_publishable_key">
            <NavigationContainer>
                <Stack.Navigator initialRouteName="LoginScreen">
                    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false, gestureEnabled: false }} />
                    <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false, gestureEnabled: false }} />
                    <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </StripeProvider>
    );
}
