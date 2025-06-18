import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { API_BASE_URL } from './services/api';

const apiURL = API_BASE_URL;

export default function Settings() {
   const [modalVisible, setModalVisible] = useState(false);
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const router = useRouter()

   const handlePasswordChange = async () => {

      if (!currentPassword || !newPassword || !confirmPassword) {
         Alert.alert('All fields are required.');
         return;
      }

      if (newPassword !== confirmPassword) {
         Alert.alert('New passwords do not match.');
         return;
      }

      try {
         const token = await AsyncStorage.getItem("userToken");
         if (!token) {
            Alert.alert('User not authenticated');
            return;
         }

         const response = await axios.post(
            `${apiURL}/users/changePassword`,
            {
               current_password:currentPassword,
               new_password:newPassword
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "ngrok-skip-browser-warning": "69420"
               }
            }
         );
         
         console.log('Password change success:', response.data);

         Alert.alert('Password changed successfully. Please log in again.');
         setModalVisible(false);
         setCurrentPassword('');
         setNewPassword('');
         setConfirmPassword('');

         router.replace('/login');
      } catch (error) {
         console.log('Password change error:', error);
         const message = (error as any)?.response?.data?.message || 'Failed to change password.';
         Alert.alert(message);
      }
   }
   return (
      <View style={styles.container}>
         {/* Password Section */}
         <TouchableOpacity style={styles.item} onPress={() => setModalVisible(true)}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inline}>
               <Text style={styles.value}>*****</Text>
               <Feather name="chevron-right" size={18} />
            </View>
         </TouchableOpacity>

         {/* Language Section */}
         <View style={styles.item}>
            <Text style={styles.label}>Language</Text>
            <View style={styles.inline}>
               <Text style={styles.value}>English</Text>
            </View>
         </View>

         {/*Modal for Password */}
         <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
               <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Change Password</Text>
                  <TextInput
                     secureTextEntry
                     placeholder="Current Password"
                     style={styles.input}
                     value={currentPassword}
                     onChangeText={setCurrentPassword}
                  />
                  <TextInput
                     secureTextEntry
                     placeholder="New Password"
                     style={styles.input}
                     value={newPassword}
                     onChangeText={setNewPassword}
                  />
                  <TextInput
                     secureTextEntry
                     placeholder="Confirm New Password"
                     style={styles.input}
                     value={confirmPassword}
                     onChangeText={setConfirmPassword}
                  />
                  <View style={styles.modalActions}>
                     <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={styles.cancel}>Cancel</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => {
                        handlePasswordChange();
                     }}>
                        <Text style={styles.save}>Save</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'rgba(236, 250, 216, 1)',
      padding: 16,
   },
   item: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
   },
   label: {
      fontSize: 14,
      color: '#333',
      marginBottom: 6,
   },
   inline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   value: {
      fontSize: 16,
      fontWeight: '500',
   },
   connectButton: {
      backgroundColor: '#3b5998',
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
   },
   connectText: {
      color: '#fff',
      fontWeight: '600',
   },
   modalBackground: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
   },
   modalContainer: {
      backgroundColor: '#fff',
      marginHorizontal: 20,
      borderRadius: 12,
      padding: 20,
   },
   modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
   },
   input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
   },
   modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 20,
   },
   cancel: {
      fontSize: 16,
      color: 'red',
   },
   save: {
      fontSize: 16,
      color: 'green',
      fontWeight: '600',
   },
});
