import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = process.env.API_URL || "localhost:3000";

export default function FoodDetail() {
  const { id } = useLocalSearchParams();
  const { food_item_id } = useLocalSearchParams();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [goalId, setGoalId] = useState();

  const getGoalId = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log(token);
      if (!token) {
        alert("User not authenticated");
        return;
      }

      console.log("GETTING TODAY GOAL");
      const res = await axios.get(`${API_URL}/goals/getTodayGoal`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      console.log(res.data.goal_id);
      setGoalId(res.data.goal_id);
    } catch (err) {
      console.log("Failed to get ttoday goal");
      console.error(err);
    }
  };

  const addToNutritionLog = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      if (!goalId) {
        alert("Goal not loaded yet.");
        return;
      }

      const pst = await axios.post(
        `${API_URL}/nutrition/addNutritionRecipe`,
        { recipe_id: id, quantity: 1, goal_id: goalId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      console.log(pst);
    } catch (err: any) {
      console.error("Add to Nutrition Log Error:", err);
      alert("Failed to update Nutrition Log.");
    }
  };

  useEffect(() => {
    if (!food_item_id) return;

    setLoading(true);
    fetch(`${API_URL}/food_items/${food_item_id}`)
      .then((res) => res.json())
      .then((data) => setFood(data))
      .catch(() => setFood({ name: "Unknown Food" }))
      .finally(() => setLoading(false));
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
        <TouchableOpacity
          style={styles.submitBtn2}
          onPress={() => {
            /* TODO: add to log */
          }}
        >
          <Text style={styles.submitText2} onPress={addToNutritionLog}>
            Add to Nutrition Log
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace("/barcodescanner")}
        >
          <Text style={styles.backText}>Back to Scanner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(236,250,216,1)",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: { fontWeight: "600", marginTop: 10 },
  value: { fontSize: 16, marginTop: 4 },
  submitBtn2: {
    backgroundColor: "#FF9800",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#FFA726",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  submitText2: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  backBtn: {
    backgroundColor: "#545454",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 1,
  },
});
