// ./app/(tabs)/scanner/_layout.tsx
import { Stack } from "expo-router";

export default function ScannerLayout() {
  return (
    <Stack>
      <Stack.Screen name="scannerScreen" options={{ headerShown: false }} />
      <Stack.Screen name="highlight" options={{ headerShown: false }} />
      <Stack.Screen name="fact-check" options={{ headerShown: false }} />
    </Stack>
  );
}
