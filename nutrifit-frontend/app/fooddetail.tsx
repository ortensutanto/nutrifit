import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_URL = process.env.API_URL || "localhost:3000";

export default function FoodDetail() {
  const { food_item_id } = useLocalSearchParams();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // For demo, use dummy data:
    // In production, fetch from API:
    // fetch(`http://${API_URL}/food_items/${food_item_id}`) ...
    setTimeout(() => {
      if (food_item_id === 'milk-123') {
        setFood({
          name: 'Milk',
          calories_per_unit: 120,
          portion: '250 ml',
          protein: 8,
          carbs: 12,
          fat: 5,
        });
      } else {
        setFood({
          name: 'Unknown Food',
          calories_per_unit: 0,
          portion: '-',
        });
      }
      setLoading(false);
    }, 800);
  }, [food_item_id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38C933" />
        <Text>Loading food detail...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{food.name}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Calories/portion:</Text>
        <Text style={styles.value}>{food.calories_per_unit} kcal</Text>
        <Text style={styles.label}>Portion:</Text>
        <Text style={styles.value}>{food.portion}</Text>
        {food.protein !== undefined && (
          <>
            <Text style={styles.label}>Protein:</Text>
            <Text style={styles.value}>{food.protein} g</Text>
          </>
        )}
        {food.carbs !== undefined && (
          <>
            <Text style={styles.label}>Carbohydrates:</Text>
            <Text style={styles.value}>{food.carbs} g</Text>
          </>
        )}
        {food.fat !== undefined && (
          <>
            <Text style={styles.label}>Fat:</Text>
            <Text style={styles.value}>{food.fat} g</Text>
          </>
        )}
      </View>
      <View style={{ gap: 10 }}>
         <TouchableOpacity style={styles.submitBtn2} onPress={() => {/* TODO: add to log */}}>
            <Text style={styles.submitText2}>Add to Nutrition Log</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/barcodescanner')}>
            <Text style={styles.backText}>Back to Scanner</Text>
         </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'rgba(236,250,216,1)',
      padding: 20,
   },
   center: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
   },
   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
   card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
   label: { fontWeight: '600', marginTop: 10 },
   value: { fontSize: 16, marginTop: 4 },
   submitBtn2: {
      backgroundColor: '#FF9800',
      borderRadius: 25,
      paddingVertical: 14,
      alignItems: 'center',
      marginVertical: 10,
      shadowColor: '#FFA726',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
   },
   submitText2: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: 1,
   },
   backBtn: {
      backgroundColor: '#545454',
      borderRadius: 25,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 2,
   },
   backText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
      letterSpacing: 1,
   },

});
