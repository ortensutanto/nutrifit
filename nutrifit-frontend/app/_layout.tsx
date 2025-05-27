import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="welcome"   options={{ headerShown: false }} />
      <Stack.Screen name="register"   options={{ headerShown: false }} />
      <Stack.Screen name="goals"   options={{ headerShown: false }} />
      <Stack.Screen name="create"   options={{ headerShown: false }} />
      <Stack.Screen name="login"     options={{ headerShown: false }} />
      <Stack.Screen name="barcodescanner" options={{ title: 'Scan Barcode' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    
  );
}
