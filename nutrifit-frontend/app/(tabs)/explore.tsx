import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL } from "../services/api";

type FoodItem = {
  food_item_id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
};

const apiURL = API_BASE_URL;
const HISTORY_KEY = 'search_history'

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(HISTORY_KEY);
        if (stored) setHistory(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };
    loadHistory();
  }, []);

  const saveHistory = async (newHistory: string[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (err) {
      console.error("Failed to save history", err);
    }
  };

  const handleDeleteHistory = async (item: string) => {
    const newHistory = history.filter(h => h !== item);
    setHistory(newHistory);
    await saveHistory(newHistory);
  };

  const handleScanBarcode = () => {
    router.push('/barcodescanner');
  };

  const handleSearchSubmit = async () => {
  if (!searchText.trim()) return;

  const newHistory = [searchText, ...history.filter(h => h !== searchText)];
  setHistory(newHistory);
  await saveHistory(newHistory);

  try {
    const response = await axios.get(`${apiURL}/foodSearch/getFoodDetailFromName`, {
      params: { name: searchText }
    });

    if (Array.isArray(response.data)) {
      setSearchResults(response.data);
    } else {
      console.warn("Unexpected response:", response.data);
      setSearchResults([]);
    }
  } catch (err) {
    console.error("Failed to search food:", err);
    setSearchResults([]);
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

      {/* Tombol Clear All */}
      {history.length > 0 && (
        <TouchableOpacity
          onPress={async () => {
            setHistory([]);
            await AsyncStorage.removeItem(HISTORY_KEY);
          }}
          style={{ alignSelf: 'flex-end', marginRight: 16, marginBottom: 8 }}
        >
          <Text style={{ color: 'red' }}>Clear All</Text>
        </TouchableOpacity>
      )}

      {/* History list */}
      <FlatList
        data={history}
         keyExtractor={(item, index) => index.toString()}
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
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.food_item_id}
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>{item.name}</Text>
              <Text style={styles.resultDetail}>Calories: {item.calories}</Text>
              <Text style={styles.resultDetail}>Protein: {item.protein}g</Text>
              <Text style={styles.resultDetail}>Fat: {item.fat}g</Text>
              <Text style={styles.resultDetail}>Carbs: {item.carbohydrate}g</Text>
            </View>
          )}
        />
      )}
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
  resultCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultDetail: {
    fontSize: 14,
    color: '#555',
  },
});
