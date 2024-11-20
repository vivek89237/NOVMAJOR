import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/Login';
import Detail from './src/Detail';
import Dashboard from './src/Dashboard';
import Fetch from './src/Fetch';
import Home from './src/Home';

const Stack=createStackNavigator();

export default function App(){
  return(

    <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={Detail} options={{headerShown:false}}/>
      <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown:false}}/>
      <Stack.Screen name="Fetch" component={Fetch} options={{ headerShown: false }} />
        </Stack.Navigator>
        </NavigationContainer>
  );
}