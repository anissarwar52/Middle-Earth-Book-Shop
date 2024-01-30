import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ImageBackground,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseconfig'; // Path to your firebaseconfig.js file


const { width, height } = Dimensions.get('window');

const LoginPage = ({ navigation }) => {




  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [animation] = useState(new Animated.Value(0));
 

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };




  const backgroundOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const containerTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const logoOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const inputTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  const buttonOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1],
  });

  const handleSignUp = () => {
    navigation.navigate('SignupPage');
  };

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Login successful');
        navigation.navigate('MainPage'); // Navigate to MainPage on successful login
      })
      .catch((error) => {
        console.log('Login error:', error);
        Alert.alert('Error', 'Invalid email or password.');
        navigation.navigate('LoginPage'); // Navigate back to LoginPage on login error
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <ImageBackground
          source={require('../assets/ring.jpg')}
          style={styles.imageBackground}
          imageStyle={styles.backgroundImage}
        >
          <Animated.View
            style={[
              styles.background,
              {
                opacity: backgroundOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.contentContainer,
              {
                transform: [{ translateY: containerTranslateY }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Text style={{fontFamily: 'lotr', fontSize: 40, color: 'white'}}>MIDDLE EARTH BOOKSTORE</Text>
            </View>
            <Animated.View
              style={[
                styles.inputContainer,
                { transform: [{ translateY: inputTranslateY }] },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="white"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="white"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.buttonContainer,
                { opacity: buttonOpacity },
              ]}
            >
              <TouchableOpacity
                style={[styles.button, styles.signUpButton]}
                onPress={handleSignUp}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.loginButton]}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  logoContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: width - 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'white',
    marginBottom: 12,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'goldenrod',
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'green',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default LoginPage;
