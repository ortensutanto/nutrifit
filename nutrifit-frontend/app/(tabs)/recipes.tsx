import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// const dummyData = Array(4).fill({
//   title: "Protein Pizza",
//   calories: "66 Kcal",
//   image:
//     "https://m.ftscrt.com/static/recipe/c707153d-d657-47d5-ae6e-4de50214099f.jpg",
// });

const sections = ["Breakfast", "Lunch", "Dinner"];

export default function RecipesScreen() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const calorieOptions = ["0 - 200", "200 - 400", "400 - 600", "> 600"];

  const getCalorieRange = (filter: string) => {
    if (filter === "0 - 200") return [0, 200];
    if (filter === "200 - 400") return [200, 400];
    if (filter === "400 - 600") return [400, 600];
    if (filter === "> 600") return [600, Infinity];
    return [0, Infinity];
  };

  const filteredRecipes = selectedFilter
  ? recipes.filter((recipe: any) => {
      const [min, max] = getCalorieRange(selectedFilter);
      return recipe.calories >= min && recipe.calories <= max;
    })
  : recipes;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          // "https://content-formally-primate.ngrok-free.app/recipes/getRecipesMenu",
          // {
          //   headers: {
          //     "ngrok-skip-browser-warning": "69420",
          //   },
          // }
          "http://localhost:3000/recipes/getRecipesMenu"
        );
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setDropdownVisible(false);
  };

  const renderSection = ({ item: section }: { item: string }) => (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredRecipes}
        horizontal={false}
        numColumns={2}
        keyExtractor={(_, index) => section + index}
        renderItem={({ item }) => <RecipeCard item={item} />}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBar}>
        <Feather
          name="search"
          size={20}
          color="#555"
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Find Recipe"
          style={styles.searchInput}
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={() => setDropdownVisible(true)}>
          <Feather name="chevron-down" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {selectedFilter ? (
        <Text style={styles.filterText}>Filtered: {selectedFilter}</Text>
      ) : null}

      {/* Modal Dropdown */}
      <Modal visible={dropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdown}>
            {calorieOptions.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.dropdownItem}
                onPress={() => handleFilterSelect(option)}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Banner */}
      <TouchableOpacity style={styles.recommendation}>
        <Text style={styles.recommendText}>
          Try Our Food Recipe Recommendation
        </Text>
        <Text style={{ fontSize: 18 }}>✨</Text>
      </TouchableOpacity>

      {/* Sections rendered in FlatList */}
      <FlatList
        data={sections}
        keyExtractor={(item) => item}
        renderItem={(section) => renderSection(section)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function RecipeCard({ item }: { item: any }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: "/recipedetail", params: { id: item.recipe_id } })}
    >
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.cardFooter}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="droplet" size={14} color="#aaa" />
          <Text style={styles.calorieText}>
            {item.calories ? `${item.calories} kcal` : 'N/A'}
          </Text>
        </View>
        <Feather name="heart" size={16} color="#aaa" />
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(236, 250, 216, 1)",
    padding: 16,
    paddingTop: 50,
    paddingBottom: 200,
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  recommendation: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recommendText: {
    fontSize: 15,
    color: "#1a1a1a",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: 14,
    color: "#007AFF",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    width: "47%",
    margin: "1.5%",
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calorieText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
  },
  filterText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 10,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 100,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 10,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
});
