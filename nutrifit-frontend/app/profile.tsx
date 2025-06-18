import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from './services/api';

const apiURL = API_BASE_URL;

export default function ProfilePage() {
   const [username, setUsername] = useState('');
   const [weight, setWeight] = useState('');
   const [height, setHeight] = useState('');
   const [age, setAge] = useState('');
   const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Not Authenticated');
          return;
        }

        const response = await axios.get(`${apiURL}/users/getData`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
          },
        });

      const userData = response.data.data[0];
      const { display_name, weight, height, age } = userData;  

        setUsername(display_name || '');
        setWeight(weight ? String(weight) : '');
        setHeight(height ? String(height) : '');
        setAge(age ? String(age) : '');
        console.log('Fetched user data:', response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

   const handleProfilePicChange = () => {
      Alert.alert('Profile picture change triggered (demo)');
    // You can integrate ImagePicker from expo-image-picker here
   };

   const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
      };

      if (username.trim() !== '') {
        await axios.post(`${apiURL}/users/editDisplayName`, { display_name: username }, { headers });
      }

      const weightNum = parseFloat(weight);
      if (!isNaN(weightNum)) {
        await axios.post(`${apiURL}/users/editWeight`, { weight: weightNum }, { headers });
      }

      const heightNum = parseFloat(height);
      if (!isNaN(heightNum)) {
        await axios.post(`${apiURL}/users/editHeight`, { height: heightNum }, { headers });
      }

      const ageNum = parseInt(age);
      if (!isNaN(ageNum)) {
        await axios.post(`${apiURL}/users/editAge`, { age: ageNum }, { headers });
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading user data...</Text>
      </View>
    );
  }


   return (
      <View style={styles.container}>
         {/* Profile Image & Username */}
         <View style = {styles.profileHeader}>
            <TouchableOpacity onPress={handleProfilePicChange}>
               <View>
                  <Image
                     source={require('@/assets/images/default-avatar.jpg')} 
                     style={styles.avatar}
                  />
                  <View style={styles.plusIcon}>
                     <Feather name="plus" size={16} color="#fff" />
                  </View>
               </View>
            </TouchableOpacity>

            <View style={styles.usernameEdit}>
               <TextInput
                  value={username}
                  onChangeText={setUsername}
                  style={styles.username}
                  placeholder="Display Name"
               />
               <MaterialIcons name="edit" size={18} color="#000" style={{ marginLeft: 0.5 }} />
            </View>
         </View>

         {renderInput('Current Weight (kg):', weight, setWeight)}
         {renderInput('Height (cm):', height, setHeight)}
         {renderInput('Age:', age, setAge)}

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
         </TouchableOpacity>

      </View>
   );
}

function renderInput(label: string, value: string, setter: (val:string) => void){
   return(
      <View style={styles.inputBox}>
         <TextInput placeholder={label} placeholderTextColor= "#333" value={value} onChangeText={setter} style={styles.input} />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'rgba(236, 250, 216, 1)',
      padding: 20,
   },
   profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
   },
   avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderColor: '#000',
      borderWidth: 2,
   },
   plusIcon: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      backgroundColor: '#00E000',
      borderRadius: 10,
      padding: 2,
      borderWidth: 1,
      borderColor: '#fff',
   },
   usernameEdit: {
      marginLeft: 10,
      flexDirection: 'row',
      alignItems: 'center',
   },
   username: {
      fontSize: 20,
      fontWeight: 'bold',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingBottom: 2,
      minWidth: 100,
   },
   title: {
      fontSize: 20,
      fontWeight: 'bold',
   },

   inputBox: {
      backgroundColor: '#fff',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 12,
   },
   input: {
      fontSize: 16,
      color: '#000',
   },
   saveButton: {
      marginTop: 20,
      backgroundColor: '#007bff',
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
   },
   saveButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
   },
});
