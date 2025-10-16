import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLogin = () => {
    alert(`Logging in with ${email}`);
  };

  const handleForgotPassword = () => {
    alert(`Password reset link sent to ${forgotEmail}`);
    setForgotModalVisible(false);
    setForgotEmail("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ justifyContent: "center", padding: 15 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-outline" size={24} color="#4F86F7" />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/emi.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      {/* Email */}
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

      {/* Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.inputPassword}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setForgotModalVisible(true)}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Forgot Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={forgotModalVisible}
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalTitle}>Forgot Password</Text>
            <TextInput
              style={modalStyles.modalInput}
              placeholder="Enter your email"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              keyboardType="email-address"
            />
            <TouchableOpacity style={modalStyles.modalButton} onPress={handleForgotPassword}>
              <Text style={modalStyles.modalButtonText}>Send Reset Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.modalClose}
              onPress={() => setForgotModalVisible(false)}
            >
              <Text style={{ color: "#4F86F7", fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },

  backButton: {
    marginBottom: 15,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },

  title: { fontSize: 24, fontWeight: "700", color: "#111", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 20, textAlign: "center" },

  inputGroup: { marginBottom: 15 },
  label: { fontWeight: "500", marginBottom: 4, color: "#555" },

  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },

  forgotText: {
    color: "#4F86F7",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },

  button: {
    backgroundColor: "#4F86F7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

// Modal Styles
const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#4F86F7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  modalClose: { marginTop: 10 },
});