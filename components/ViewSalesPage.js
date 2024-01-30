import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { app } from '../firebaseconfig';

const db = getFirestore(app);

const ViewSalesPage = ({ navigation }) => {
  const [sales, setSales] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    filterSales();
  }, [startDate, endDate, searchText]);

  useEffect(() => {
    if (selectedDate) {
      filterSalesByDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchSales = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'sales'));
      const salesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSales(salesData);
      setFilteredSales(salesData); 
    } catch (error) {
      console.log('Error fetching sales:', error);
    }
  };

  const filterSales = () => {
    let filteredSales = sales;

    if (startDate || endDate || searchText) {
      filteredSales = sales.filter((sale) => {
        const saleDate = new Date(sale.date);
        const isDateInRange =
          (!startDate || saleDate >= startDate) && (!endDate || saleDate <= endDate);
        const isTitleMatch =
          searchText === '' ||
          sale.titles.find((title) => title.toLowerCase().includes(searchText.toLowerCase()));
        return isDateInRange && isTitleMatch;
      });
    }

    setFilteredSales(filteredSales);
  };

  const filterSalesByDate = (date) => {
    const filteredSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      const selectedDate = new Date(date);
      return saleDate.toDateString() === selectedDate.toDateString();
    });
    setFilteredSales(filteredSales);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectedDate(date);
      setShowDatePicker(false);
    }
  };

  const navigateToSaleDetails = (item) => {
    navigation.navigate('SaleDetails', { sale: item });
  };

  const renderSaleItem = ({ item }) => (
    <TouchableOpacity style={styles.saleItem} onPress={() => navigateToSaleDetails(item)}>
      <View>
        <Text style={[styles.title, { color: '#ffd700' }]}>ITEM </Text>
        {item.titles.map((title, index) => (
          <Text key={index} style={[styles.info, { color: '#ffd700' }]}>
            {title} - Quantity: {item.quantities[index]}
          </Text>
        ))}
        <Text style={[styles.info, { color: '#ffd700' }]}>Total Price: ${item.totalPrice}</Text>
        <Text style={[styles.info, { color: '#ffd700' }]}>Date: {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title"
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#d1d1d1"
      />
      <TouchableOpacity style={styles.dateInput} onPress={showDatepicker}>
        <Text style={styles.dateInputText}>
          {selectedDate ? selectedDate.toDateString() : 'Select date (YYYY-MM-DD)'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {filteredSales.length > 0 ? (
        <FlatList data={filteredSales} keyExtractor={(item) => item.id} renderItem={renderSaleItem} />
      ) : (
        <Text style={styles.noSalesText}>No sales found</Text>
      )}
    </View>
  );
};

const SaleDetails = ({ route }) => {
  const { sale } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sale Detail</Text>
      <View style={styles.saleDetails}>
        <Text style={styles.label}>ITEM</Text>
        {sale.titles.map((title, index) => (
          <Text key={index} style={styles.titleInfo}>
            {title}
          </Text>
        ))}
        <Text style={styles.label}>Quantities:</Text>
        {sale.quantities.map((quantity, index) => (
          <Text key={index} style={styles.info}>
            {quantity}
          </Text>
        ))}
        <Text style={styles.label}>Total Price:</Text>
        <Text style={styles.info}>${sale.totalPrice}</Text>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.info}>{sale.date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  searchInput: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ffd700',
    borderRadius: 8,
    color: '#d1d1d1',
  },
  saleItem: {
    marginBottom: 20,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },  
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffd700',
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
    color: '#ffd700',
  },
  noSalesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    color: '#d1d1d1',
  },
  saleDetails: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffd700',
  },
  titleInfo: {
    fontSize: 16,
    marginBottom: 4,
    textDecorationLine: 'underline',
    color: '#ffd700',
  },
  dateInput: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ffd700',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateInputText: {
    color: '#ffd700',
  },
});

export { ViewSalesPage, SaleDetails };
