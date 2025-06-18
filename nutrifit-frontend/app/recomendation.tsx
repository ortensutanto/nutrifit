import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { API_BASE_URL } from "./services/api";

interface Recipe {
  recipe_id: string;
  title: string;
  calories: number;
  image_url: string;
}

const apiURL = API_BASE_URL;

const Recomendation = () => {
  const [loading, setLoading] = useState<boolean>();
  const [resp, setResp] = useState<Recipe[]>([]);

  const router = useRouter();

  const fetchAPI = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Not Authenticated", "Please login first.");
        return;
      }

      const res = await axios.get(
        `${apiURL}/recipes/getRecipesRecommendationMenu`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420"
          },
        }
      );
      setResp(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch recomendation: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Your Personalized Food Recommendations 🍽️
      </Text>

      {/* Sample card */}
      {resp?.map(({ calories, image_url, recipe_id, title }): any => (
        <TouchableOpacity
          key={recipe_id}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/recipedetail",
              params: { id: recipe_id },
            })
          }
        >
          <Image
            source={{ uri: image_url }} // Use dynamic image from API
            style={styles.image}
          />
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDesc}>Calories: {calories}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
    backgroundColor: "rgba(236, 250, 216, 1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardDesc: {
    color: "#555",
    marginTop: 4,
  },
});

export default Recomendation;
