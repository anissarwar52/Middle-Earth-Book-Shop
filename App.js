import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import AddBooksPage from './components/AddBooksPage';
import ViewBooksPage from './components/ViewBooksPage';
import { ViewSalesPage, SaleDetails } from './components/ViewSalesPage';
import AddSalePage from './components/AddSalePage';
import EditBookPage from './components/EditBookPage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginPage"
        screenOptions={{
          headerShown: false, // Hide the navigation header
        }}
      >
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="SignupPage" component={SignupPage} />
        <Stack.Screen name="MainPage" component={MainPage} />
        <Stack.Screen name="AddBooksPage" component={AddBooksPage} />
        <Stack.Screen name="ViewBooksPage" component={ViewBooksPage} />
        <Stack.Screen name="ViewSalesPage" component={ViewSalesPage} />
        <Stack.Screen name="SaleDetails" component={SaleDetails} />
        <Stack.Screen name="AddSalePage" component={AddSalePage} />
        <Stack.Screen name="EditBookPage" component={EditBookPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
