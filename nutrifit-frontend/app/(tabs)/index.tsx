import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserData } from "../context/userDataContext";
import { API_BASE_URL } from "../services/api";

const apiURL = API_BASE_URL;

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
    const hydrateAndFetch = async () => {
      try {
        const storedName = await AsyncStorage.getItem("displayName");
        if (storedName) {
          setUserData((prev) => ({
            ...prev,
            displayName: storedName,
          }));
        }
        setIsHydrated(true);
      } catch (err) {
        console.error("Error restoring user displayName:", err);
      }
    };

    hydrateAndFetch();
  }, []);

  const fetchGoalData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        console.error("Token or userId not found");
        return;
      }

      const goalInfoResponse = await axios.get(`${apiURL}/goals/getGoalInfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      let goalId;

      if (goalInfoResponse.data?.data?.length > 0) {
        goalId = goalInfoResponse.data.data[0].goal_id;
      } else {
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

        const response = await axios.post(
          `${apiURL}/goals/calculateGoals`,
          {
            goal_type: goalType,
            target_weight_change: targetWeightChange,
            target_time_weeks: targetTimeWeeks,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        goalId = response.data.goal_id;
      }

      if (!goalId) {
        console.error("No goal_id found after checking or calculating.");
        return;
      }

      const calorieResponse = await axios.get(
        `${apiURL}/goals/getCalorieNeeded?goal_id=${goalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
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
          </View>
        </View>
        {loading && (
          <Text style={styles.loadingText}>Loading goal data...</Text>
        )}
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
