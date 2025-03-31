import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ErrorBoundary } from "./error-boundary";
import colors from "@/constants/colors";
import { useProfileStore } from "@/store/profile-store";
import { useThemeStore } from "@/store/theme-store";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isOnboarded } = useProfileStore();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  useEffect(() => {
    // Check if the user is on the root route
    const inAuthGroup = segments[0] === 'onboarding';
    
    if (!isOnboarded && !inAuthGroup) {
      // Redirect to the onboarding flow if not onboarded
      router.replace('/onboarding/profile');
    } else if (isOnboarded && inAuthGroup) {
      // Redirect to the main app if already onboarded
      router.replace('/');
    }
  }, [isOnboarded, segments, router]);
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme.background,
        },
        headerTintColor: colorScheme.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: colorScheme.background,
        },
        headerShown: false, // Hide all headers by default and use custom headers
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="discipline/edit" 
        options={{ 
          title: "Edit Discipline",
          presentation: "modal",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="discipline/create" 
        options={{ 
          title: "New Discipline",
          presentation: "modal",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Settings",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="journal/history" 
        options={{ 
          title: "Journal History",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="journal/entry" 
        options={{ 
          title: "Journal Entry",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="journal/index" 
        options={{ 
          title: "Journal",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="wisdom/index" 
        options={{ 
          title: "Wisdom",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="growth/history" 
        options={{ 
          title: "Growth History",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="learning/history" 
        options={{ 
          title: "Learning History",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="onboarding/profile" 
        options={{ 
          title: "Create Profile",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="subscription" 
        options={{ 
          title: "Premium Subscription",
          headerShown: false,
        }} 
      />
    </Stack>
  );
}