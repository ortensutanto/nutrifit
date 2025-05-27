import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';

export default function RegisterCreate() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Create an account</Text>

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={user}
          onChangeText={setUser}
        />

        <View style={styles.pwRow}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPw}
            style={[styles.input, { flex:1 }]}
            value={pw}
            onChangeText={setPw}
          />
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            <Feather
              name={showPw ? 'eye-off' : 'eye'}
              size={20}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>

        <View style={styles.signinRow}>
          <Text style={styles.prompt}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.signinLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    paddingTop: 50,
  },
  back: {
    marginBottom:24,
  },
  title: {
    fontSize:22, 
    fontWeight:'600', 
    marginBottom:24,
  },
  input: {
    borderWidth:1, 
    borderColor:'#ccc', 
    borderRadius:25,
    padding:12, 
    marginBottom:16,
  },
  pwRow: {
    flexDirection:'row', 
    alignItems:'center', 
    marginBottom:16,
  },
  createButton: {
    backgroundColor:'#38C933', 
    paddingVertical:14,
    borderRadius:25, 
    alignItems:'center', 
    marginTop:10,
  },
  createText: {
    color:'#fff', 
    fontSize:16, 
    fontWeight:'600',
  },
  signinRow: {
    flexDirection:'row', 
    justifyContent:'center', 
    marginTop:20,
  },
  prompt: {
    fontSize:14, 
    color:'#333',
  },
  signinLink: {
    fontSize:14, 
    color:'#0066CC', 
    fontWeight:'500',
  },
});
