import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function RecipeDetail(){
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState('');

   const submitReview = () => {
      console.log('⭐ Rating:', rating);
      console.log('📝 Comment:', comment);
      // Later: save to backend or context
      setRating(0);
      setComment('');
      alert('Thanks for your review!');
   };

   return(
      <ScrollView style={styles.container}>
         <Image
            source={require('@/assets/images/recipe-salad.png')} // Replace with dynamic data later
         style={styles.image}
      />
      <Text style={styles.title}>Healthy Taco Salad</Text>
      <Text style={styles.sectionTitle}>Ingredients:</Text>

      <Text style={styles.sectionTitle}>Instructions:</Text>

      <View style={styles.wrapper}>
         {/* Creator Info */}
         <Text style={styles.sectionTitle}>Creator</Text>
         <View style={styles.creatorBox}>
            <Image
               source={require('@/assets/images/default-avatar.jpg')}
               style={styles.avatar}
            />
            <View>
               <Text style={styles.creatorName}>Creator#1</Text>
               <Text style={styles.creatorDesc}>I'm the author and recipe developer.</Text>
            </View>
         </View>

         {/* Rating & Review */}
         <Text style={styles.sectionTitle2}>Leave a Review</Text>

         <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
               <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <FontAwesome
                     name={i <= rating ? 'star' : 'star-o'}
                     size={28}
                     color="#FFD700"
                     style={styles.star}
                  />
               </TouchableOpacity>
            ))}
         </View>

         <TextInput
            placeholder="Tell us what you think..."
            multiline
            value={comment}
            onChangeText={setComment}
            style={styles.commentBox}
         />

         <TouchableOpacity style={styles.submitBtn} onPress={submitReview}>
            <Text style={styles.submitText}>Submit Review</Text>
         </TouchableOpacity>
      </View>
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
   wrapper: {
      backgroundColor: 'rgba(236, 250, 216, 1)',
      padding: 16,
      marginTop: 24,
   },
   sectionTitle2: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
   },
   creatorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
   },
   avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
   },
   creatorName: {
      fontSize: 16,
      fontWeight: '600',
   },
  creatorDesc: {
    color: '#555',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    marginRight: 4,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  submitBtn: {
    backgroundColor: '#38C933',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});