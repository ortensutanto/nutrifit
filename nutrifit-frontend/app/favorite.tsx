import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
   ActivityIndicator,
   Alert,
   FlatList,
   Image,
   StyleSheet,
   Text,
   TouchableOpacity,
   View
} from "react-native";

type FavoriteRecipeItem = {
  recipe_id: string;
  title: string;
  image_url: string;
};

export default function FavoriteRecipe() {
  const [favorites, setFavorites] = useState<FavoriteRecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

   useEffect(() => {
    fetchFavorites();
   }, []);

   const fetchFavorites = async () => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         if (!token) {
         Alert.alert("Not Authenticated", "Please login first.");
         return;
         }

         const response = await axios.get("http://localhost:3000/favorites/getUserFavorites", {
         headers: {
            Authorization: `Bearer ${token}`,
         },
         });

         setFavorites(response.data.favorites);
      } catch (err: any) {
         console.error("Failed to fetch favorites:", err);
         Alert.alert("Error", err.response?.data?.error || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteFavorite = async (recipeId: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      await axios.delete("http://localhost:3000/favorites/removeFavorite", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          recipe_id: recipeId,
        },
   });

  // Hapus dari list lokal
      setFavorites((prev) => prev.filter((item) => item.recipe_id !== recipeId));
    } catch (err: any) {
      console.error("Failed to delete favorite:", err);
      Alert.alert("Error", err.response?.data?.error || "Failed to remove from favorites");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38C933" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>You have no favorite recipes yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Favorite Recipes</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/recipedetail",
                  params: { id: item.recipe_id },
                })
              }
            >
              <Image source={{ uri: item.image_url }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleDeleteFavorite(item.recipe_id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(236, 250, 216, 1)",
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: "rgba(236, 250, 216, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  text: {
    fontSize: 16,
    color: "#555",
  },
});