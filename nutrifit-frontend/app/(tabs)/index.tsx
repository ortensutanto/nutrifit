import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserData } from "../context/userDataContext";
import { router } from "expo-router";

const apiURL = "http://localhost:3000";

export default function HomeScreen() {
  const [goalData, setGoalData] = useState({
    goalCalories: 0,
    consumedCalories: 0,
    caloriesDeficit: 0,
    exerciseCalories: 0,
  });

  const [exerciseData, setExerciseData] = useState({
    caloriesBurned: 180,
    durationMinutes: 30,
  });

  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const { userData, setUserData } = useUserData();

  useEffect(() => {
    fetchGoalData();
  }, []);

  useEffect(() => {
    const hydrateUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("displayName");
        if (storedName) {
          setUserData((prev) => ({
            ...prev,
            displayName: storedName,
          }));
        }
        setIsHydrated(true); // agar muncul teks Welcome
      } catch (err) {
        console.error("Error restoring user displayName:", err);
      }
    };

    hydrateUserData().then(() => {
      fetchGoalData(); // ✅ panggil fetch setelah selesai hydrate
    });
  }, []);

  const fetchGoalData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      console.log("Retrieved token:", token);

      if (!token || !userId) {
        console.error("Token or userId not found");
        return;
      }

      const goalType = (() => {
        switch ((userData.primaryGoal || "").toLowerCase()) {
          case "lose weight":
            return 1;
          case "gain weight":
            return 2;
          default:
            return 3;
        }
      })();

      const targetWeightChange = Number(userData.targetWeight || 0);
      const targetTimeWeeks = Number(userData.targetTime || 1);

      await axios.post(
        `${apiURL}/goals/calculateGoals`,
        {
          goal_type: goalType,
          target_weight_change: targetWeightChange,
          target_time_weeks: targetTimeWeeks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const goalInfoResponse = await axios.get(`${apiURL}/goals/getGoalInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const goalList = goalInfoResponse.data.data;
      const goalId = goalList?.[0]?.goal_id;

      if (!goalId) {
        console.error("No goal_id found");
        return;
      }

      const calorieResponse = await axios.get(
        `${apiURL}/goals/getCalorieNeeded?goal_id=${goalId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { goal_calories, consumed_calories, calories_deficit } =
        calorieResponse.data;

      setGoalData({
        goalCalories: goal_calories,
        consumedCalories: consumed_calories,
        caloriesDeficit: calories_deficit,
        exerciseCalories: exerciseData.caloriesBurned,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "Error fetching goal data:",
        axiosError.response?.data || axiosError.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated || loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.welcomeText}>
            {isHydrated
              ? `Welcome back, ${userData.displayName || "User"}!`
              : "Welcome back..."}
          </Text>
          <Text style={styles.brandCentered}>NutriFit</Text>
        </View>
        <Feather name="bell" size={22} color="#000" style={styles.bellIcon} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calories</Text>
        <Text style={styles.cardSubtitle}>
          Remaining = Goal - Food + Exercise
        </Text>
        <View style={styles.calorieContent}>
          <View style={styles.calorieCircle}>
            <Text style={styles.calorieValue}>{goalData.caloriesDeficit}</Text>
            <Text style={styles.calorieLabel}>Remaining</Text>
          </View>
          <View style={styles.calorieBreakdown}>
            <Text style={styles.breakdownText}>
              🎯 Base Goal : {goalData.goalCalories}
            </Text>
            <Text style={styles.breakdownText}>
              🍽️ Food : {goalData.consumedCalories}
            </Text>
            <Text style={styles.breakdownText}>
              🔥 Exercise : {goalData.exerciseCalories}
            </Text>
          </View>
        </View>
        {loading && (
          <Text style={styles.loadingText}>Loading goal data...</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Macronutrients</Text>
        <Text style={styles.cardSubtitle}>Total intake (grams)</Text>
        <View style={styles.macroContainer}>
          <View style={styles.macroCircle}>
            <Text style={styles.macroValue}>150g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroCircle}>
            <Text style={styles.macroValue}>80g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroCircle}>
            <Text style={styles.macroValue}>60g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.metricBox}>
          <MaterialCommunityIcons name="cup-water" size={40} color="#009EFF" />
          <TouchableOpacity style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.metricValue}>0.5 L</Text>
          <Text style={styles.metricLabel}>Daily Water Intake</Text>
          <Text style={styles.subLabel}>Recommended: 2L</Text>
        </View>

        <View style={styles.metricBox}>
          <MaterialCommunityIcons name="fire" size={40} color="#F49A00" />
          <TouchableOpacity style={styles.syncIcon}>
            <Feather name="plus" size={16} color="#000" />
          </TouchableOpacity>
          <Text style={styles.metricValue}>
            {exerciseData.caloriesBurned} kcal
          </Text>
          <Text style={styles.metricLabel}>Exercise</Text>
          <Text style={styles.subLabel}>
            {exerciseData.durationMinutes} minutes
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitBtn2}
        onPress={() =>
          router.push({
            pathname: "/nutrition",
          })
        }
      >
        <Text style={styles.submitText}>View Nutrition Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(236, 250, 216, 1)",
    padding: 16,
    paddingBottom: 40,
    paddingTop: 40,
  },
  headerContainer: {
    marginBottom: 20,
    height: 40,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#38C933",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "left",
  },
  brandCentered: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
  },
  bellIcon: {
    position: "absolute",
    right: 0,
  },
  card: {
    backgroundColor: "#c6f7b6",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  calorieContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  calorieCircle: {
    backgroundColor: "#fff",
    borderRadius: 60,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  calorieLabel: {
    fontSize: 12,
    color: "#666",
  },
  calorieBreakdown: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  breakdownText: {
    fontSize: 13,
    marginVertical: 2,
  },
  weightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weightText: {
    fontSize: 18,
    fontWeight: "600",
  },
  weightGoal: {
    color: "#aaa",
    fontSize: 14,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  plusButton: {
    position: "absolute",
    top: 4,
    right: 8,
    backgroundColor: "#009EFF",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  syncIcon: {
    position: "absolute",
    top: 4,
    right: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  subLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  macroContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  macroCircle: {
    backgroundColor: "#fff",
    borderRadius: 60,
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  macroLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  submitBtn2: {
    backgroundColor: "#c6f7b6",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  submitText: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 16,
  },
});
