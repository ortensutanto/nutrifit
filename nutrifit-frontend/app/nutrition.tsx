import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_BASE_URL } from "./services/api";

interface Data {
  food_item_id: string;
  quantity: number;
  recipe_id: string;
}

const apiURL = API_BASE_URL;

export default function NutritionSummaryScreen() {
  // Dummy data (you can replace these later with API values)
  const [goalCalories, setGoalCalories] = useState<number>();
  const [consumedCalories, setConsumedCalories] = useState<number>();
  const [remaining, setRemaining] = useState<number>();
  const [nutritionLog, setNutritionLog] = useState([
    { name: "Chicken Salad", calories: 350 },
    { name: "Rice & Egg", calories: 400 },
    { name: "Banana Smoothie", calories: 500 },
  ]);
  const [loading, setLoading] = useState(true);

  const [food, setFood] = useState();

  const getGoalFromAPI = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      // cari goal id
      const goalResponse = await axios.get(
        `${apiURL}/goals/getTodayGoal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const goalId = goalResponse.data.goal_id;
      if (!goalId) return;

      // cari nutrition summary dari goal id
      const summaryResponse = await axios.get(
        `${apiURL}/nutrition/getNutritionSummary?goal_id=${goalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const nutritionData = summaryResponse.data;

      const getcaloriesneed = await axios.get(
        `${apiURL}/goals/getCalorieNeeded/`,
        {
          params: { goal_id: goalId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(getcaloriesneed);

      setGoalCalories(getcaloriesneed.data.goal_calories);
      setConsumedCalories(getcaloriesneed.data.consumed_calories);
      setRemaining(getcaloriesneed.data.calories_deficit);

      setConsumedCalories(nutritionData.calories);

      // cari data dari recipe id
      const foodDetails: any = await Promise.all(
        nutritionData.data.map((item: any) =>
          axios
            .get(`${apiURL}/recipes/getRecipeId`, {
              params: { recipe_id: item.recipe_id },
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => res.data)
        )
      );

      setFood(foodDetails);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    // Future API integration:
    // const fetchData = async () => {
    //   const token = await AsyncStorage.getItem('userToken');
    //   const goalId = await AsyncStorage.getItem('goal_id');
    //
    //   const goalRes = await axios.get(`${API_URL}/goals/getCalorieNeeded?goal_id=${goalId}`, { headers: { Authorization: `Bearer ${token}` } });
    //   setGoalCalories(goalRes.data.calorie_needed);
    //
    //   const logRes = await axios.get(`${API_URL}/nutrition-log/today`, { headers: { Authorization: `Bearer ${token}` } });
    //   setConsumedCalories(logRes.data.totalCalories);
    //   setNutritionLog(logRes.data.logs);
    // };
    //
    // fetchData();
    getGoalFromAPI();
    return () => clearTimeout(timer);
  }, []);

  // const remaining = goalCalories - consumedCalories;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38C933" />
        <Text>Loading your nutrition summary...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nutrition Summary</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Goal Calories:</Text>
        <Text style={styles.value}>{goalCalories} kcal</Text>

        <Text style={styles.label}>Consumed:</Text>
        <Text style={styles.value}>{consumedCalories} kcal</Text>

        <Text style={styles.label}>Remaining:</Text>
        <Text
          style={[
            styles.value,
            { color: (remaining ?? 0) < 0 ? "red" : "green" },
          ]}
        >
          {remaining} kcal
        </Text>
      </View>

      <Text>Today&apos;s Nutrition Log</Text>
      {nutritionLog.length > 0 ? (
        <FlatList
          data={food}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text style={styles.foodName}>{item.title}</Text>
              <Text style={styles.foodCal}>{item.calories} kcal</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ color: "#777" }}>No logs today.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(236, 250, 216, 1)",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 90,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subheader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
  },
  logItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  foodName: {
    fontSize: 14,
    fontWeight: "500",
  },
  foodCal: {
    fontSize: 14,
    color: "#555",
  },
});
