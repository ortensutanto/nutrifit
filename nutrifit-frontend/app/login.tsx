// app/login.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View
} from 'react-native';

export default function LoginScreen() {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const router = useRouter();

   return (
      <ScrollView contentContainerStyle={styles.container}>
         <Text style={styles.title}>Sign In</Text>

         <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            style={styles.input}
         />

         <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            style={styles.input}
         />

         <View style={styles.row}>
            <TouchableOpacity
               style={styles.button}
               onPress={() => router.replace('/(tabs)')}
            >
               <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {/* TODO: forgot password */}}>
               <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
         </View>

         <View style={styles.signupRow}>
            <Text style={styles.signupPrompt}>Don't have any account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
               <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      padding: 20,
      paddingTop: 60,
      alignItems: 'center',
   },
   title: {
      alignSelf: 'flex-start',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
   },
   input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 12,
   },
   row: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 16,
   },
   button: {
      backgroundColor: '#38C933',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
   forgotText: {
      color: '#666',
      fontSize: 14,
   },
   signupRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
   },
   signupPrompt: {
      fontSize: 14,
      color: '#333',
   },
   signupLink: {
      fontSize: 14,
      color: '#0066CC',
      fontWeight: '500',
   },
});
