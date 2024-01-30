import React, { useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const MainPage = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    ring: require('../assets/fonts/Bilbo.ttf'),
    lotr: require('../assets/fonts/ringg.ttf')
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);
  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  const handleLogout = () => {
    navigation.navigate('LoginPage');
  };

  const handleAddBooks = () => {
    navigation.navigate('AddBooksPage');
  };

  const handleViewBooks = () => {
    navigation.navigate('ViewBooksPage');
  };

  const handleViewSales = () => {
    navigation.navigate('ViewSalesPage');
  };

  const handleAddSales = () => {
    navigation.navigate('AddSalePage');
  };

  const GradientTouchableOpacity = ({ onPress, children }) => (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <LinearGradient colors={['#C9AD88', '#8D704B']} style={styles.buttonGradient}>
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#262626" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.title}>BOOK STORE MANAGEMENT</Text>
        <GradientTouchableOpacity onPress={handleAddBooks}>
          <Text style={styles.buttonText}>Add Books</Text>
        </GradientTouchableOpacity>
        <GradientTouchableOpacity onPress={handleViewBooks}>
          <Text style={styles.buttonText}>View Books</Text>
        </GradientTouchableOpacity>
        <GradientTouchableOpacity onPress={handleViewSales}>
          <Text style={styles.buttonText}>View Sales</Text>
        </GradientTouchableOpacity>
        <GradientTouchableOpacity onPress={handleAddSales}>
          <Text style={styles.buttonText}>Add Sale</Text>
        </GradientTouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  logoutText: {
    color: '#F4EAD5',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'ring', // Use the custom font family here
  },
  title: {
    fontFamily: 'lotr', // Use the custom font family here
    fontSize: 50,
    color: 'white',
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: 'ring', // Use the custom font family here
    fontSize: 30,
    color: 'white',
  },
  buttonContainer: {
    marginTop: 20,
    width: 200,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#F4EAD5',
    borderWidth: 2,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default MainPage;
