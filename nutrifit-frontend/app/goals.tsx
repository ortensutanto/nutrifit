import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';

const PRIMARY_OPTIONS = ['Lose Weight', 'Gain Weight', 'Maintain Weight'];
const SECONDARY_OPTIONS = ['Gain Muscle', 'Modify Diet', 'Manage Stress'];

export default function RegisterGoals() {
  const router = useRouter();
  const [preferredName, setPreferredName] = useState('');

  const [primaryDropdownOpen, setPrimaryDropdownOpen] = useState(false);
  const [secondaryDropdownOpen, setSecondaryDropdownOpen] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState('');
  const [selectedSecondary, setSelectedSecondary] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} />
      </TouchableOpacity>
      <Text style={styles.header}>Welcome</Text>
      <Text style={styles.subheader}>We'd like to get to know you</Text>

      <TextInput
        placeholder="Preferred name"
        value={preferredName}
        onChangeText={setPreferredName}
        style={styles.input}
      />

      {/* Primary Goal */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setPrimaryDropdownOpen(!primaryDropdownOpen)}
      >
        <Text style={styles.dropdownLabel}>
          {selectedPrimary || 'Select Primary Goals'}
        </Text>
        <Feather name={primaryDropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} />
      </TouchableOpacity>
      {primaryDropdownOpen && PRIMARY_OPTIONS.map((option, i) => (
        <TouchableOpacity
          key={i}
          style={styles.option}
          onPress={() => {
            setSelectedPrimary(option);
            setPrimaryDropdownOpen(false);
          }}
        >
          <Text>{option}</Text>
          <View style={styles.checkbox}>
            {selectedPrimary === option && <View style={styles.checkboxChecked} />}
          </View>
        </TouchableOpacity>
      ))}

      {/* Secondary Goal */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setSecondaryDropdownOpen(!secondaryDropdownOpen)}
      >
        <Text style={styles.dropdownLabel}>
          {selectedSecondary || 'Select Secondary Goals'}
        </Text>
        <Feather name={secondaryDropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} />
      </TouchableOpacity>
      {secondaryDropdownOpen && SECONDARY_OPTIONS.map((option, i) => (
        <TouchableOpacity
          key={i}
          style={styles.option}
          onPress={() => {
            setSelectedSecondary(option);
            setSecondaryDropdownOpen(false);
          }}
        >
          <Text>{option}</Text>
          <View style={styles.checkbox}>
            {selectedSecondary === option && <View style={styles.checkboxChecked} />}
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push('/create')}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({  
  container: { 
    padding: 20, 
    paddingTop: 50,
  },
  back: {
    marginBottom:24,
  },
  header: { 
    fontSize: 22, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  subheader: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 24 
  },
  input: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8,
    padding: 12, 
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: '#38C933',
    borderRadius: 2,
  },
  nextButton: {
    backgroundColor: '#38C933',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
