import { StyleSheet, Text, View } from 'react-native';

export default function FavoriteRecipe() {
   return (
      <View style={styles.container}>
         <Text style={styles.text}>Your Favorite Recipes</Text>
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
