import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { useUserData } from './context/userDataContext';

// Define types for our data
type Gender = 'Male' | 'Female';
type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extra Active';

const PRIMARY_OPTIONS = ['Lose Weight', 'Gain Weight', 'Maintain Weight'] as const;
const SECONDARY_OPTIONS = ['Gain Muscle', 'Modify Diet', 'Manage Stress'] as const;
const GENDER_OPTIONS = ['Male', 'Female'] as const;
const ACTIVITY_LEVELS = [
  'Sedentary',
  'Lightly Active',
  'Moderately Active',
  'Very Active',
  'Extra Active',
] as const;

const GENDER_MAP: Record<Gender, number> = {
  Male: 0,
  Female: 1,
};

const GENDER_LABELS: Record<number, Gender> = {
  0: 'Male',
  1: 'Female',
};

const ACTIVITY_MAP: Record<ActivityLevel, number> = {
  Sedentary: 1,
  'Lightly Active': 2,
  'Moderately Active': 3,
  'Very Active': 4,
  'Extra Active': 5,
};

const ACTIVITY_LABELS: Record<number, ActivityLevel> = {
  1: 'Sedentary',
  2: 'Lightly Active',
  3: 'Moderately Active',
  4: 'Very Active',
  5: 'Extra Active',
};

export default function RegisterGoals() {
  const router = useRouter();
  const { userData, setUserData } = useUserData();

  const [primaryDropdownOpen, setPrimaryDropdownOpen] = useState(false);
  const [secondaryDropdownOpen, setSecondaryDropdownOpen] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [activityDropdownOpen, setActivityDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNumberChange = (key: string, text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setUserData((prev) => ({
      ...prev,
      [key]: cleaned === '' ? null : Number(cleaned),
    }));
  };

  const handleNext = () => {
    const {
      preferredName,
      primaryGoal,
      secondaryGoal,
      age,
      gender,
      height,
      weight,
      activityLevel,
    } = userData;

    if (
      !preferredName ||
      !primaryGoal ||
      !secondaryGoal ||
      age === null ||
      gender === null ||
      height === null ||
      weight === null ||
      activityLevel === null
    ) {
      setErrorMessage('Please complete all fields before continuing.');
      return;
    }

    setErrorMessage('');
    router.push('/create');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} />
      </TouchableOpacity>

      <Text style={styles.header}>Welcome</Text>
      <Text style={styles.subheader}>We&apos;d like to get to know you</Text>

      <TextInput
        placeholder="Preferred name"
        value={userData.preferredName || ''}
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, preferredName: text }))
        }
        style={styles.input}
      />

      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        value={userData.age !== null ? String(userData.age) : ''}
        onChangeText={(text) => handleNumberChange('age', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={userData.height !== null ? String(userData.height) : ''}
        onChangeText={(text) => handleNumberChange('height', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={userData.weight !== null ? String(userData.weight) : ''}
        onChangeText={(text) => handleNumberChange('weight', text)}
        style={styles.input}
      />

      {/* Dropdown Gender */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setGenderDropdownOpen(!genderDropdownOpen)}
      >
        <Text style={styles.dropdownLabel}>
          {userData.gender !== null
            ? GENDER_LABELS[userData.gender]
            : 'Select Gender'}
        </Text>
        <Feather name={genderDropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} />
      </TouchableOpacity>
    {genderDropdownOpen &&
      GENDER_OPTIONS.map((option: keyof typeof GENDER_MAP, i) => {
        const isSelected = userData.gender === GENDER_MAP[option]; // <--- tambahkan ini

        return (
          <TouchableOpacity
            key={i}
            style={styles.option}
            onPress={() => {
              setUserData((prev) => ({
                ...prev,
                gender: GENDER_MAP[option],
              }));
              setGenderDropdownOpen(false);
            }}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
              {option}
            </Text>
            <View style={styles.checkbox}>
              {isSelected && <View style={styles.checkboxChecked} />}
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Dropdown Activity Level */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setActivityDropdownOpen(!activityDropdownOpen)}
      >
        <Text style={styles.dropdownLabel}>
          {userData.activityLevel !== null
            ? ACTIVITY_LABELS[userData.activityLevel]
            : 'Select Activity Level'}
        </Text>
        <Feather name={activityDropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} />
      </TouchableOpacity>
      {activityDropdownOpen &&
        ACTIVITY_LEVELS.map((option, i) => {
          const isSelected = userData.activityLevel === ACTIVITY_MAP[option];
          return (
            <TouchableOpacity
              key={i}
              style={styles.option}
              onPress={() => {
                setUserData((prev) => ({
                  ...prev,
                  activityLevel: ACTIVITY_MAP[option],
                }));
                setActivityDropdownOpen(false);
              }}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
              <View style={styles.checkbox}>
                {isSelected && <View style={styles.checkboxChecked} />}
              </View>
            </TouchableOpacity>
          );
        })}

      {/* Dropdown Primary Goal */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setPrimaryDropdownOpen(!primaryDropdownOpen)}
      >
        <Text style={styles.dropdownLabel}>
          {userData.primaryGoal || 'Select Primary Goals'}
        </Text>
        <Feather name={primaryDropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} />
      </TouchableOpacity>
      {primaryDropdownOpen &&
        PRIMARY_OPTIONS.map((option, i) => {
          const isSelected = userData.primaryGoal === option;
          return (
            <TouchableOpacity
              key={i}
              style={styles.option}
              onPress={() => {
                setUserData((prev) => ({ ...prev, primaryGoal: option }));
                setPrimaryDropdownOpen(false);
              }}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
              <View style={styles.checkbox}>
                {isSelected && <View style={styles.checkboxChecked} />}
              </View>
            </TouchableOpacity>
          );
        })}

        
      {/* Dropdown Secondary Goal */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setSecondaryDropdownOpen(!secondaryDropdownOpen)}
      >
        <Text style={styles.dropdownLabel}>
          {userData.secondaryGoal || 'Select Secondary Goals'}
        </Text>
        <Feather name={secondaryDropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} />
      </TouchableOpacity>
      {secondaryDropdownOpen &&
        SECONDARY_OPTIONS.map((option, i) => {
          const isSelected = userData.secondaryGoal === option;
          return (
            <TouchableOpacity
              key={i}
              style={styles.option}
              onPress={() => {
                setUserData((prev) => ({ ...prev, secondaryGoal: option }));
                setSecondaryDropdownOpen(false);
              }}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
              <View style={styles.checkbox}>
                {isSelected && <View style={styles.checkboxChecked} />}
              </View>
            </TouchableOpacity>
          );
        })}

      <TextInput
        placeholder="Target weight change (kg)"
        keyboardType="numeric"
        value={userData.targetWeight !== null ? String(userData.targetWeight) : ''}
        onChangeText={(text) => handleNumberChange('targetWeight', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Target time (week)"
        keyboardType="numeric"
        value={userData.targetTime !== null ? String(userData.targetTime) : ''}
        onChangeText={(text) => handleNumberChange('targetTime', text)}
        style={styles.input}
      />

      <Text style={{ fontSize: 12, color: 'gray', marginTop: 20 }}>
        {JSON.stringify(userData, null, 2)}
      </Text>

      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f9f9f9',
  },
  back: {
    marginBottom: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
    color: '#222',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dropdownLabel: {
    fontSize: 15,
    color: '#555',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fafafa',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    backgroundColor: '#38C933',
    borderRadius: 3,
  },
  nextButton: {
    backgroundColor: '#38C933',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#38C933',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  optionText: {
  fontSize: 16,
  color: '#333',
  },

  optionTextSelected: {
    fontWeight: '700',
    color: '#111',
  },
});
