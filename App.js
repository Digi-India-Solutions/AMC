import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Platform, Animated } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import HomeScreen from "./screens/HomeScreen";
import EmcManagementScreen from "./screens/EmcManagementScreen";
import WalletScreen from "./screens/WalletScreen";
import AmcDetailScreen from "./screens/AmcDetailScreen";
import CreateAmcScreen from "./screens/CreateAmcScreen";
import TransactionScreen from "./screens/TransactionsScreen";
import ProfileScreen from './screens/ProfileScreen'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#999",
        tabBarLabelStyle: { fontSize: 12, paddingBottom: Platform.OS === "ios" ? 5 : 3 },
        tabBarStyle: {
          backgroundColor: "#fff",
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 6,
          borderTopWidth: 0.6,
          borderTopColor: "#ddd",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 10,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "WEC") iconName = "cube-outline";
          else if (route.name === "Wallet") iconName = "wallet-outline";
          else if (route.name === "Transaction") iconName = "swap-horizontal-outline";
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="WEC" component={EmcManagementScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Transaction" component={TransactionScreen} />
    </Tab.Navigator>
  );
}

function SplashScreen({ onFinish }) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();


    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Image
          source={require("./assets/1.png")}
          style={{ width: 200, height: 200, resizeMode: "contain" }}
        />
        <Text style={styles.splashText}>AMC Management</Text>
      </Animated.View>
    </View>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="CreateAmcScreen" component={CreateAmcScreen} />
            <Stack.Screen name="AMCDetail" component={AmcDetailScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  splashText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 15,
    letterSpacing: 1,
  },
});