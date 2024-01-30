import React, { useState, useEffect } from 'react';
import { TextInput, FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { app } from '../firebaseconfig';
import Modal from 'react-native-modal';

const db = getFirestore(app);

const AddSalePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    try {
      const q = query(collection(db, 'books'), where('title', '>=', searchQuery));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSuggestions(items);
    } catch (error) {
      console.log('Error fetching suggestions:', error);
    }
  };

  const handleSelectSuggestion = (item) => {
    const existingItem = billItems.find((billItem) => billItem.id === item.id);
    if (existingItem) {
      const updatedItems = billItems.map((billItem) =>
        billItem.id === item.id ? { ...billItem, quantity: billItem.quantity + 1 } : billItem
      );
      setBillItems(updatedItems);
    } else {
      const newBillItem = { id: item.id, title: item.title, quantity: 1, price: item.price };
      setBillItems([...billItems, newBillItem]);
    }
  };

  const handleQuantityChange = (item, quantity) => {
    const updatedItems = billItems.map((billItem) =>
      billItem.id === item.id ? { ...billItem, quantity } : billItem
    );
    setBillItems(updatedItems);
  };

  const calculateTotalPrice = () => {
    const totalPrice = billItems.reduce((total, billItem) => total + billItem.price * billItem.quantity, 0);
    setTotalPrice(totalPrice);
  };

  const handleAddItem = () => {
    calculateTotalPrice();

    setSearchQuery('');
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    if (billItems.length === 0) {
      setModalText('Nothing to add');
      setModalVisible(true);
      return;
    }

    try {
      const saleData = {
        titles: billItems.map((billItem) => billItem.title),
        quantities: billItems.map((billItem) => billItem.quantity),
        totalPrice: totalPrice,
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, 'sales'), saleData);

      setBillItems([]);
      setTotalPrice(0);

      setModalText('Sale added successfully');
      setModalVisible(true);
    } catch (error) {
      console.log('Error uploading sale data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#666666"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              <Text style={styles.suggestionText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Text style={styles.billTitle}>Bill</Text>
      {billItems.map((billItem) => (
        <View key={billItem.id} style={styles.billItem}>
          <Text style={styles.billItemTitle}>{billItem.title}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(billItem, billItem.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{billItem.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(billItem, billItem.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.priceText}>Price: ${billItem.price}</Text>
        </View>
      ))}
      <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addButtonLabel}>Add Item</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      <Modal isVisible={modalVisible} backdropOpacity={0.5}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalText}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ffd700',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#fff',
  },
  suggestionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#666666',
  },
  suggestionText: {
    color: '#fff',
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#fff',
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  billItemTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#fff',
  },
  priceText: {
    color: '#666666',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#ffd700',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonLabel: {
    color: '#000',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#6eb746',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: '#ffd700',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: '#000',
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#ffd700',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default AddSalePage;
