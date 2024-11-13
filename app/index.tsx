import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { BasketProvider } from "../Context"; // Ensure correct import
import VegetableListVendor from '../screens/VegetableListVendor'; // Home screen
import CurrentOrder from '../screens/currentOrder'; // Track Current Orders screen
import OrderHistory from '../screens/orderHistory'; // Past Orders screen
import RateOrder from '../screens/RateOrder';
import OrderConfirmation from '../orderConfirmation';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import Map from '~/components/Map';
import VendorMap from '~/components/VendorMap';
import ScooterProvider from '~/provider/ScooterProvider';
import OrderTracking from '~/components/OrderTracking';



import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { IconButton } from 'react-native-paper'; // Import IconButton

import SearchFeature from '~/components/SearchFeature';
import MapScreen from '~/components/MapScreen'; // Import MapScreen


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function TabNavigator() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Track Orders') {
            iconName = focused ? 'time' : 'time-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Past Orders') {
            iconName = 'history';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } 
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#414442' }
      })}
    >
      <Tab.Screen name="Home" component={Map}  options={{ headerShown: false }} />
      <Tab.Screen name="Track Orders" component={MapScreen} />
      <Tab.Screen name="Past Orders" component={OrderHistory} />
    </Tab.Navigator>
  );
}

export default function App() {

  return (
    <BasketProvider>
      <ScooterProvider>
        <Stack.Navigator>
          {/* Main Tab Navigator */}

          <Stack.Screen
            name="MapScreen"
            component={MapScreen}
            options={{ title: 'Set Location' }}
          />
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Search"
            component={SearchFeature}
            options={{ headerShown: false }}
          />
          
          <Stack.Screen
            name="Map"
            component={Map}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="VendorMap"
            component={VendorMap}
            options={{ title: 'Vendor Map' }}
          />

          <Stack.Screen
            name="OrderHistory"
            component={OrderHistory}
            options={{ title: 'Order History' }}
          />

          <Stack.Screen 
          name="VegetableListVendor" 
          component={VegetableListVendor} 
          options={{ headerLeft: null }} 
          />

          <Stack.Screen 
          name="OrderConfirmation" 
          component={OrderConfirmation} 
          options={{ headerLeft: null }} 
          />

          <Stack.Screen
            name="order-tracking"
            component={OrderTracking}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="RateOrder"
            component={RateOrder}
            options={({ navigation }) => ({
              title: 'Rate your Order',
              headerLeft: () => (
                <IconButton
                  icon="arrow-left"
                  onPress={() => navigation.goBack()}
                />
              ),
            })}
          />

          
        </Stack.Navigator>

        <StatusBar style="auto" />
      </ScooterProvider>
    </BasketProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
