import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Image,
} from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../firebaseconfig';
const db = getFirestore(app);

const ViewBooksPage = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const genres = [ 'fantasy', 'Action'];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const q = selectedGenre === '' ? query(collection(db, 'books')) : query(collection(db, 'books'), where('genre', '==', selectedGenre));
        const querySnapshot = await getDocs(q);
        const fetchedBooks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBooks(fetchedBooks);
        setFilteredBooks(fetchedBooks);
      } catch (error) {
        console.log('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [selectedGenre]);

  const handleSearch = () => {
    const filteredBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filteredBooks);
  };

  const handleFilter = (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre('');
      setFilteredBooks(books);
    } else {
      setSelectedGenre(genre);
    }
  };

  const resetFilters = () => {
    setSelectedGenre('');
    setFilteredBooks(books);
  };

  const handleEditBook = (id) => {
    navigation.navigate('EditBookPage', { bookId: id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by book or author"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          placeholderTextColor="#fff"
        />
        <Button title="Search" onPress={handleSearch} color="#ffd700" />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={resetFilters}
          disabled={!selectedGenre}
        >
          <Text style={styles.filterButtonText}>
            {selectedGenre ? 'Clear Filter' : 'Filter'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.genreContainer}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[
              styles.genreButton,
              selectedGenre === genre && styles.selectedGenreButton,
            ]}
            onPress={() => handleFilter(genre)}
          >
            <Text
              style={[
                styles.genreButtonText,
                selectedGenre === genre && styles.selectedGenreButtonText,
              ]}
            >
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {filteredBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookContainer}>
              <Image
                style={styles.bookImage}
                source={{ uri: `data:image/jpeg;base64,${item.image}` }}
              />
              <View style={styles.bookDetails}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>By {item.author}</Text>
                <Text style={styles.price}>Price: ${item.price}</Text>
                <Text style={styles.genre}>Genre: {item.genre}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleEditBook(item.id)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noBooksText}>No books available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#000',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ffd700',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: '#fff',
  },
  filterButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#ffd700',
    borderRadius: 5,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#000',
  },
  genreContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  genreButton: {
    padding: 8,
    marginRight: 10,
    backgroundColor: '#ffd700',
    borderRadius: 5,
  },
  selectedGenreButton: {
    backgroundColor: 'red',
  },
  genreButtonText: {
    fontSize: 14,
    color: '#000',
  },
  selectedGenreButtonText: {
    fontWeight: 'bold',
  },
  bookContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  bookDetails: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  genre: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: '#ffd700',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
  },
  noBooksText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
});

export default ViewBooksPage;
