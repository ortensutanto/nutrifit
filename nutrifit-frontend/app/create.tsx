import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUserData } from './context/userDataContext';
import { registerUser } from './services/api';

export default function Create() {
  const router = useRouter();
  const { userData, setUserData } = useUserData();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      // Validate all required fields
      if (!userData.email || !userData.password) {
        setErrorMessage('Please enter email and password');
        return;
      }

      if (!userData.preferredName || !userData.primaryGoal || !userData.secondaryGoal) {
        setErrorMessage('Please complete all previous steps first');
        return;
      }

      if (userData.age === null || userData.gender === null ||
        userData.height === null || userData.weight === null ||
        userData.activityLevel === null) {
        setErrorMessage('Please complete your profile information first');
        return;
      }

      // Additional validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        setErrorMessage('Please enter a valid email address');
        return;
      }

      if (userData.password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long');
        return;
      }

      if (userData.age < 13 || userData.age > 120) {
        setErrorMessage('Please enter a valid age between 13 and 120');
        return;
      }

      if (userData.height < 50 || userData.height > 300) {
        setErrorMessage('Please enter a valid height between 50cm and 300cm');
        return;
      }

      if (userData.weight < 20 || userData.weight > 500) {
        setErrorMessage('Please enter a valid weight between 20kg and 500kg');
        return;
      }

      setLoading(true);
      setErrorMessage('');

      console.log('Attempting registration with data:', {
        ...userData,
        password: '***', // Hide password in logs
        email: userData.email,
        preferredName: userData.preferredName,
        age: userData.age,
        gender: userData.gender,
        height: userData.height,
        weight: userData.weight,
        activityLevel: userData.activityLevel,
        primaryGoal: userData.primaryGoal,
        secondaryGoal: userData.secondaryGoal
      });

      console.log('User data:', userData);
      // Call API to register user
      await registerUser(userData);

      // Registration successful
      Alert.alert(
        'Success',
        'Registration successful! Please login.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/login'),
          },
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} />
      </TouchableOpacity>

      <Text style={styles.header}>Create Account</Text>
      <Text style={styles.subheader}>Last step to complete your registration</Text>

      <TextInput
        placeholder="Email"
        value={userData.email}
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, email: text }))
        }
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={userData.password}
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, password: text }))
        }
        style={styles.input}
        secureTextEntry
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerText}>Create Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  registerButton: {
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
  registerText: {
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
});
