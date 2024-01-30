import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseconfig';

const db = getFirestore(app);

const EditBookPage = ({ navigation, route }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookDocRef = doc(db, 'books', bookId);
        console.log('bookDocRef:', bookDocRef);
        const bookDocSnapshot = await getDoc(bookDocRef);
        console.log('bookDocSnapshot:', bookDocSnapshot);
  
        if (bookDocSnapshot.exists()) {
          const fetchedBook = bookDocSnapshot.data();
          console.log('fetchedBook:', fetchedBook);
          setBook(fetchedBook);
          setTitle(fetchedBook.title);
          setAuthor(fetchedBook.author);
          setPrice(fetchedBook.price);
          setGenre(fetchedBook.genre);
          setDescription(fetchedBook.description);
        } else {
          console.log('Book does not exist');
        }
      } catch (error) {
        console.log('Error fetching book:', error);
      }
    };
  
    fetchBook();
  }, [bookId]);
  

  const handleUpdateBook = async () => {
    try {
      const bookDocRef = doc(db, 'books', bookId);
      await updateDoc(bookDocRef, {
        title,
        author,
        price,
        genre,
        description,
      });
      navigation.goBack();
    } catch (error) {
      console.log('Error updating book:', error);
    }
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateBook}>
        <Text style={styles.buttonText}>Update Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // Black background color
  },
  input: {
    height: 40,
    borderColor: '#ffd700', // Golden border color
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#fff', // White text color
  },
  button: {
    backgroundColor: '#ffd700', // Golden background color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000', // Black text color
  },
});

export default EditBookPage;
