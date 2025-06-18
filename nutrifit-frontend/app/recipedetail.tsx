import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "./services/api";

/* logic??
const addToNutritionLog = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      alert('User not authenticated');
      return;
    }

    const calories = recipe.calories || 0;

    const res = await axios.post('http://localhost:3000/nutrition-log/add', {
      recipe_id: id,
      calories,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Nutrition log added:", res.data);
    alert("Added to your nutrition log!");
  } catch (err) {
    console.error("Add to nutrition log error:", err);
    alert("Failed to log nutrition.");
  }
};
 */

const apiURL = API_BASE_URL;

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [addToLog, setAddToLog] = useState();
  const [goalId, setGoalId] = useState();

  const toggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      if (isFavorite) {
        // Remove from favorites
        const response = await axios.delete(
          `${apiURL}/favorites/removeFavorite`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420"
            },
            data: {
              recipe_id: id,
            },
          }
        );

        console.log("Removed from favorites:", response.data);
        setIsFavorite(false);
        alert("Removed from favorites!");
      } else {
        // Add to favorites
        const response = await axios.post(
          `${apiURL}/favorites/favoriteRecipe`,
          { recipe_id: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
                  "ngrok-skip-browser-warning": "69420"
            },
          }
        );

        console.log("Added to favorites:", response.data);
        setIsFavorite(true);
        alert("Added to favorites!");
      }
    } catch (err: any) {
      console.error("Favorite toggle error:", err);
      alert("Failed to update favorite status.");
    }
  };

  const getGoalId = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log(token)
      if (!token) {
        alert("User not authenticated");
        return;
      }

      console.log("GETTING TODAY GOAL")
      const res = await axios.get(`${apiURL}/goals/getTodayGoal`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420"
        },
      });
      console.log(res.data.goal_id);
      setGoalId(res.data.goal_id);
    } catch (err) {
        console.log("Failed to get ttoday goal")
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

      if(!goalId) {
          alert("Goal not loaded yet.")
          return;
      }

      const pst = await axios.post(
        `${apiURL}/nutrition/addNutritionRecipe`,
        { recipe_id: id, quantity: 1, goal_id: goalId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420"
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
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/recipes/getRecipeId`,
          {
            params: { recipe_id: id },
            timeout: 5000,
          }
        );

        console.log("RECIPE DETAIL RESPONSE:", response.data);

        setRecipe(response.data);
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getGoalId();
      fetchRecipe();
    }
  }, [id]);

  const submitReview = () => {
    console.log("⭐ Rating:", rating);
    console.log("📝 Comment:", comment);
    setRating(0);
    setComment("");
    alert("Thanks for your review!");
  };

  if (loading || !recipe) {
    return <Text style={{ margin: 20 }}>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: recipe.image_url || "https://via.placeholder.com/300" }}
        style={styles.image}
      />
      <View style={styles.titleRow}>
        <Text style={styles.title}>{recipe.title}</Text>
        <TouchableOpacity
          onPress={toggleFavorite}
          style={styles.favoriteButton}
        >
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={24}
            color="#E91E63"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{recipe.description}</Text>

      <TouchableOpacity style={styles.submitBtn2} onPress={addToNutritionLog}>
        <Text style={styles.submitText}>Add to Nutrition Log</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {recipe.ingredients?.map((ing: any, idx: number) => (
        <Text key={idx} style={styles.ingredient}>
          • {ing.name}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Instructions:</Text>
      {recipe.instruction
        ?.replace(/\d+\.\s*/g, "") // hapus penomoran lama seperti "1. "
        .split(/(?<=\.)\s+/) // pisah berdasarkan titik diikuti spasi
        .map((step: string, idx: number) => (
          <Text key={idx} style={styles.instructions}>
            {idx + 1}. {step.trim()}
          </Text>
        ))}

      {/* Creator Info */}
      <Text style={styles.sectionTitle}>Creator</Text>
      <View style={styles.creatorBox}>
        <Image
          source={require("@/assets/images/default-avatar.jpg")}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.creatorName}>Author ID</Text>
          <Text style={styles.creatorDesc}>{recipe.author_id}</Text>
        </View>
      </View>

      {/* Review */}
      <Text style={styles.sectionTitle}>Leave a Review</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <FontAwesome
              name={i <= rating ? "star" : "star-o"}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(236, 250, 216, 1)",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  wrapper: {
    backgroundColor: "rgba(236, 250, 216, 1)",
    padding: 16,
    marginTop: 24,
  },
  sectionTitle2: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  creatorBox: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
  },
  creatorDesc: {
    color: "#555",
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  star: {
    marginRight: 4,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  submitBtn: {
    backgroundColor: "#38C933",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    color: "#555",
  },
  ingredient: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
    marginBottom: 2,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  favoriteButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  submitBtn2: {
    backgroundColor: "#FF9800",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 20,
  },
});
