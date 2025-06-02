import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserData } from './context/userDataContext';

export default function Register() {
  const router = useRouter();
  const { userData, setUserData } = useUserData();

  const handleContinue = () => {
    if (!userData.preferredName) {
      alert('Please enter your name');
      return;
    }
    router.push('/goals');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to NutriFit</Text>
      <Text style={styles.subheader}>Let's get started with your journey</Text>

      <TextInput
        placeholder="What should we call you?"
        value={userData.preferredName}
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, preferredName: text }))
        }
        style={styles.input}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
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
  continueButton: {
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
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
