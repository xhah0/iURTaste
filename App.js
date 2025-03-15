import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import CartScreen from './screens/CartScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import BurgerMenuScreen from './screens/BurgerMenuScreen';
import PastaMenuScreen from './screens/PastaMenuScreen';
import SushiMenuScreen from './screens/SushiMenuScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                    name="SignupScreen"
                    component={SignupScreen}
                    options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                    name="MainScreen"
                    component={MainScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="FavoritesScreen"
                    component={FavoritesScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CartScreen"
                    component={CartScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SettingsScreen"
                    component={SettingsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EditProfileScreen"
                    component={EditProfileScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BurgerMenuScreen"
                    component={BurgerMenuScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PastaMenuScreen"
                    component={PastaMenuScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SushiMenuScreen"
                    component={SushiMenuScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}