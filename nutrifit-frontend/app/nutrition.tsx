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

export default function NutritionSummaryScreen() {
  // Dummy data (you can replace these later with API values)
  const [goalCalories, setGoalCalories] = useState<number>(1800);
  const [consumedCalories, setConsumedCalories] = useState<number>(1250);
  const [nutritionLog, setNutritionLog] = useState([
    { name: "Chicken Salad", calories: 350 },
    { name: "Rice & Egg", calories: 400 },
    { name: "Banana Smoothie", calories: 500 },
  ]);
  const [loading, setLoading] = useState(true);

  const getGoalFromAPI = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      const goalId = await axios.get(
        `http://localhost:3000/goals/getTodayGoal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!goalId.data.goal_id) {
        return;
      }

      // const goalIdAsli = goalId.data.goal_id;
      // console.log(goalIdAsli);

      const res = await axios.get(
        `http://localhost:3000/nutrition/getNutritionSummary?goal_id=${goalId.data.goal_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.calories);
      // console.log(res.data.);
      // setGoalId(res.data.goal_id);
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

  const remaining = goalCalories - consumedCalories;

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
          style={[styles.value, { color: remaining < 0 ? "red" : "green" }]}
        >
          {remaining} kcal
        </Text>
      </View>

      <Text style={styles.subheader}>Today's Nutrition Log:</Text>
      {nutritionLog.length > 0 ? (
        <FlatList
          data={nutritionLog}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text style={styles.foodName}>{item.name}</Text>
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
