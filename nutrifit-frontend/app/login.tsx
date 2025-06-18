// app/login.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserData } from "./context/userDataContext";
import { API_BASE_URL } from "./services/api";

// const apiURL = "content-formally-primate.ngrok-free.app";
const apiURL = API_BASE_URL;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUserData } = useUserData();


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation error", "Please enter both email and password");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
      // const response = await fetch(`https://content-formally-primate.ngrok-free.app/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userId', data.userId)
        await AsyncStorage.setItem('displayName', data.displayName);

        setUserData((prev) => ({
          ...prev,
          displayName: data.displayName,
          email,
          password,
        }));

        Alert.alert("Login success", "Welcome!");
        router.replace("/(tabs)");
      } else {
        Alert.alert("Login Failed", data.error || "Unknown error");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            /* TODO: forgot password */
          }}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signupRow}>
        <Text style={styles.signupPrompt}>Don&apos;t have any account? </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
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
    alignItems: "center",
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  button: {
    backgroundColor: "#38C933",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotText: {
    color: "#666",
    fontSize: 14,
  },
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  signupPrompt: {
    fontSize: 14,
    color: "#333",
  },
  signupLink: {
    fontSize: 14,
    color: "#0066CC",
    fontWeight: "500",
  },
});
