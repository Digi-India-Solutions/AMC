import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Add your login logic here
    alert(`Logging in with ${email}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20, justifyContent: "center", flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.bottomText}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
          <Text style={{ color: "#4F86F7", fontWeight: "700" }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },

  title: { fontSize: 28, fontWeight: "700", color: "#111", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 30 },

  inputGroup: { marginBottom: 20 },
  label: { fontWeight: "500", marginBottom: 5, color: "#555" },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  button: {
    backgroundColor: "#4F86F7",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  bottomText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
});
