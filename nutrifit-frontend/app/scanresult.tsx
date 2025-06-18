import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_BASE_URL } from "./services/api";

const apiURL = API_BASE_URL;

export default function ScanResult() {
  const { code } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://${apiURL}/barcode/scanBarcodeAPI/${code}`
        );
        const json = await res.json();
        setProduct(json);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    if (code) fetchData();
  }, [code]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38C933" />
        <Text>Loading scan result...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || "Product not found."}</Text>
        <Button
          title="Scan Again"
          onPress={() => router.replace("/barcodescanner")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Result</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Product:</Text>
        <Text style={styles.value}>{product.name || "Unknown Item"}</Text>

        <Text style={styles.label}>Calories:</Text>
        <Text style={styles.value}>{product.calories || "N/A"} kcal</Text>

        <Text style={styles.label}>Barcode:</Text>
        <Text style={styles.value}>{code}</Text>
      </View>

      <Button
        title="Scan Another"
        onPress={() => router.replace("/barcodescanner")}
      />
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  error: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
  },
});
