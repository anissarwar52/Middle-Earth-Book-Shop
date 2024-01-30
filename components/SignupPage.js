import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Text } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseconfig'; // Path to your firebaseconfig.js file

const SignupPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Success', 'Account created successfully.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainPage'),
          },
        ]);
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to create an account. Please try again.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SignupPage'),
          },
        ]);
      });
  };

  const handleLogin = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/ring.jpg')}
        style={styles.imageBackground}
      >
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Create an Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholderTextColor="#fff"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholderTextColor="#fff"
          />
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default SignupPage;
