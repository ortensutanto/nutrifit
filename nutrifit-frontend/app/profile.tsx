import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function ProfilePage() {
   const [username, setUsername] = useState('Username');
   const [goal, setGoal] = useState('');
   const [weight, setWeight] = useState('');
   const [height, setHeight] = useState('');
   const [dob, setDob] = useState('');

   const handleProfilePicChange = () => {
      Alert.alert('Profile picture change triggered (demo)');
    // You can integrate ImagePicker from expo-image-picker here
   };

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
               <TextInput value={username} onChangeText={setUsername} style = {styles.username} placeholder="Username"/>
               <MaterialIcons name="edit" size={18} color="#000" style={{ marginLeft: 0.5 }} />
            </View>
         </View>

         {renderInput('Primary Goal:', goal, setGoal)}
         {renderInput('Current Weight:', weight, setWeight)}
         {renderInput('Height:', height, setHeight)}
         {renderInput('Date of birth:', dob, setDob)}
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
});
