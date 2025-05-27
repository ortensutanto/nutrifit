import { StyleSheet, Text, View } from 'react-native';

export default function Help() {
   return (
      <View style={styles.container}>
         <Text style={styles.text}>Help</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(236, 250, 216, 1)',
   },
   text: {
      fontSize: 20,
      fontWeight: 'bold',
   },
});
