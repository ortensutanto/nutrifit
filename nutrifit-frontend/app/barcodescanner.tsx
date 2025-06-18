import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { API_BASE_URL } from "./services/api";

const apiURL = API_BASE_URL;

export default function BarCodeScanner() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function handleBarcodeScanned({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);
    setLoading(true);

    console.log(data);

    try {
      const response = await fetch(
        `${apiURL}/barcode/scanBarcodeAPI?upc_barcode=${data}`
      );
      // const json = await response.json();

      console.log(response);

      // setResult(JSON.stringify(json));

      // Redirect to new page, optionally pass data
      router.push("/fooddetail"); // or /scan-result if you want a dedicated page
    } catch (error) {
      Alert.alert("Error", "Failed to fetch from API");
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => setScanned(false), 3000);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: [
            "ean8",
            "ean13",
            "upc_e",
            "itf14",
            "upc_a",
            "code39",
            "code93",
            "codabar",
            "code128",
          ],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  resultBox: {
    padding: 16,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  resultText: {
    fontSize: 16,
    color: "#000",
  },
});
