import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebaseconfig';

const db = getFirestore(app);

const AddBooksPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [imageURI, setImageURI] = useState(null);

  const handleAddBook = async () => {
    try {
      const bookData = {
        title,
        author,
        price,
        genre,
        description,
        image: imageURI,
      };

     
      await addDoc(collection(db, 'books'), bookData);

     
      setTitle('');
      setAuthor('');
      setPrice('');
      setGenre('');
      setDescription('');
      setImageURI(null);
    } catch (error) {
      console.log('Error adding book:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        console.log('Permission to access media library denied');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!pickerResult.cancelled) {
    
        setImageURI(pickerResult.base64); 
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      {imageURI && <Image source={{ uri: `data:image/jpeg;base64,${imageURI}` }} style={styles.image} />}
      <Button title="Pick Image" onPress={handleImagePick} color="#978B0F" />
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
        placeholderTextColor="#d1d1d1"
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        onChangeText={setAuthor}
        value={author}
        placeholderTextColor="#d1d1d1"
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        onChangeText={setPrice}
        value={price}
        keyboardType="numeric"
        placeholderTextColor="#d1d1d1"
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        onChangeText={setGenre}
        value={genre}
        placeholderTextColor="#d1d1d1"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        onChangeText={setDescription}
        value={description}
        multiline
        placeholderTextColor="#d1d1d1"
      />
      <Button title="Add Book" onPress={handleAddBook} color="#978B0F" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  input: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#d1d1d1',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default AddBooksPage;
