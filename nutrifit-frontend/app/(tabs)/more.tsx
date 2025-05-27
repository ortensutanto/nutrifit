import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function more(){
   const router = useRouter();
   const [logoutVisible, setLogoutVisible] = useState(false);

   const handleConfirmLogout = () => {
      setLogoutVisible(false);
      router.replace('/welcome'); // Redirect to welcome page
   };


   const renderItem = (label: string, iconName?: string, onPress?: () => void) => (
      <TouchableOpacity style={styles.item} onPress={onPress}>
         <Text style={styles.itemText}>{label}</Text>
         {iconName === 'edit' ? (
            <MaterialIcons name="edit" size={18} color="black" />
         ) : (
         <Feather name="chevron-right" size={18} color="black" />
         )}
      </TouchableOpacity>
   );


   return(
      <View style={styles.container}>
         {renderItem('Edit Profile', 'edit', () => router.push('/profile'))}
         {renderItem('Favorite Recipes', 'arrow', () => router.push('/favorite'))}
         {renderItem('Help?', 'arrow', () => router.push('/help'))}
         {renderItem('Settings', 'arrow', () => router.push('/settings'))}


         <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutVisible(true)}>
         <Text style={styles.logoutText}>Logout</Text>
         </TouchableOpacity>

         {/*Logout Modal */}
         <Modal
            visible={logoutVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setLogoutVisible(false)}
         >
            <View style={styles.modalOverlay}>
               <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Log out?</Text>

                  <View style={styles.modalActions}>
                     <TouchableOpacity onPress={() => setLogoutVisible(false)}>
                        <Text style={styles.cancel}>Cancel</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={handleConfirmLogout}>
                        <Text style={styles.confirm}>Yes</Text>
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
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 90,
   },
   item: {
      backgroundColor: '#fff',
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 10,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   itemText: {
      fontSize: 16,
   },
   logoutButton: {
      marginTop: 'auto',
      marginBottom: 30,
      backgroundColor: '#fff',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
   },
   logoutText: {
      color: 'red',
      fontWeight: '600',
      fontSize: 20,
   },
   modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
   },
   modalContent: {
      backgroundColor: '#fff',
      padding: 24,
      borderRadius: 12,
      width: '80%',
      alignItems: 'center',
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
   },
   modalText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
   },
   modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 20,
   },
   cancel: {
      fontSize: 16,
      color: '#999',
   },
   confirm: {
      fontSize: 16,
      color: 'red',
      fontWeight: '600',
   },
});