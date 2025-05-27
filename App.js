import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StripeProvider} from '@stripe/stripe-react-native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import CartScreen from './screens/CartScreen';
import MenuScreen from './screens/MenuScreen';
import SettingsScreen from './screens/SettingsScreen';
import DeliveryScreen from './screens/DeliveryScreen'; // Ensure this import is correct
import EditProfileScreen from './screens/EditProfileScreen';
import LocationScreen from './screens/LocationScreen';
import MyOrdersScreen from "./screens/MyOrdersScreen";
import {AuthProvider} from './contexts/AuthContext';

import OrderDetailScreen from './screens/OrderDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (

        <AuthProvider>
            <StripeProvider publishableKey="pk_test_your_publishable_key">
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="LoginScreen">
                        <Stack.Screen
                            name="LoginScreen"
                            component={LoginScreen}
                            options={{headerShown: false, gestureEnabled: false}}
                        />
                        <Stack.Screen
                            name="SignupScreen"
                            component={SignupScreen}
                            options={{headerShown: false, gestureEnabled: false}}
                        />
                        <Stack.Screen
                            name="MainScreen"
                            component={MainScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="ProfileScreen"
                            component={ProfileScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="FavoritesScreen"
                            component={FavoritesScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="CartScreen"
                            component={CartScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="MenuScreen"
                            component={MenuScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="SettingsScreen"
                            component={SettingsScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="DeliveryScreen"
                            component={DeliveryScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="MyOrdersScreen"
                            component={MyOrdersScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="EditProfileScreen"
                            component={EditProfileScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="LocationScreen"
                            component={LocationScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="OrderDetail"
                            component={OrderDetailScreen}
                            options={{headerShown: false}}
                        />


                    </Stack.Navigator>
                </NavigationContainer>
            </StripeProvider>
        </AuthProvider>
    );
}
