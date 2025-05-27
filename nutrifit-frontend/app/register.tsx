import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

export default function RegisterWelcome() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      {/* Back arrow */}
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} />
      </TouchableOpacity>

      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        Welcome! Let's Customize{'\n'}NutriFit for your goals.
      </Text>

      {/* Continue button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/goals')}
      >
        <Text style={styles.primaryText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.or}>Or</Text>

      {/* Dummy social buttons */}
      <TouchableOpacity style={styles.socialButton} onPress={() => {/* no-op */}}>
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton} onPress={() => {/* no-op */}}>
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff', 
    paddingTop: 50,
  },
  back: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20, 
    fontWeight: '600', 
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16, 
    textAlign: 'center', 
    marginVertical: 24,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#38C933',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600',
  },
  or: {
    textAlign: 'center', 
    marginVertical: 16, 
    color: '#333',
  },
  socialButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  socialText: {
    fontSize: 14,
    color: '#000',
  },
});
