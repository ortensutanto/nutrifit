import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [history, setHistory] = useState(['History #1']);

  const handleDeleteHistory = (item: string) => {
    setHistory(history.filter(h => h !== item));
  };

  const handleScanBarcode = () => {
    router.push('/barcodescanner');
  };

  const handleSearchSubmit = () => {
    if (searchText && !history.includes(searchText)) {
      setHistory([searchText, ...history]);
    }
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      {/* Top search bar */}
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} style={styles.icon} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a food or scan its barcode."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity onPress={handleScanBarcode}>
          <MaterialIcons name="qr-code-scanner" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* History list */}
      <FlatList
        data={history}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Feather name="rotate-ccw" size={16} color="#000" />
            <Text style={styles.historyText}>{item}</Text>
            <TouchableOpacity onPress={() => handleDeleteHistory(item)}>
              <Feather name="x" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(236, 250, 216, 1)',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  searchBarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 4,
    color: '#000',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0.6,
    borderColor: '#ccc',
  },
  historyText: {
    flex: 1,
    fontSize: 14,
  },
});
