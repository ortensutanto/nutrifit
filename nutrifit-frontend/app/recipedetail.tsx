import { Image, StyleSheet, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function RecipeDetail(){
   return(
      <ScrollView style={styles.container}>
         <Image
            source={require('@/assets/images/recipe-salad.png')} // Replace with dynamic data later
         style={styles.image}
      />
      <Text style={styles.title}>Healthy Taco Salad</Text>
      <Text style={styles.sectionTitle}>Ingredients:</Text>

      <Text style={styles.sectionTitle}>Instructions:</Text>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: 'rgba(236, 250, 216, 1)',
      padding: 16,
   },
   image: {
      width: '100%',
      height: 180,
      borderRadius: 12,
      marginBottom: 16,
   },
   title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
   },
   sectionTitle: {
      marginTop: 16,
      fontSize: 16,
      fontWeight: '600',
   },
});