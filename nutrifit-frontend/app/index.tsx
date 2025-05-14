import React, {useState} from "react";
import { Button, Text, View } from "react-native";

import * as SecureStore from 'expo-secure-store'; // Buat simpen data
// save(key, value) == (userToken, '...')

const API_URL = 'https://3848-140-213-35-115.ngrok-free.app' // Ini bakal ganti ganti
const LOCAL_API_URL = 'http://localhost:3000'

const GetUser = async (setUserData: React.Dispatch<React.SetStateAction<string>>) => {
  try {
    const response = await fetch(API_URL + '/users/getUser', {
      method: 'GET',
      headers: {
        "ngrok-skip-browser-warning": "1"
      }
    });
    const data = await response.json();
    setUserData(JSON.stringify(data));
  } catch(err) {
    console.log(err);
  }
};

export default function Index() {
  const [userData, setUserData] = useState<string>("");
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>Hi!</Text>
      <Button
      onPress={() => GetUser(setUserData)}
      title="GetUser In Console" 
      />
      <Text style={{ marginTop: 20 }}>{userData}</Text>
    </View>
  );
}
