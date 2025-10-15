import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient"; 
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [profile, setProfile] = useState({
    name: "Rohit Rajput",
    email: "rohit@example.com",
    phone: "+91 9876543210",
  });

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={["#4F86F7", "#6AA9FF"]}
        style={styles.headerContainer}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>My Profile</Text> */}
      </LinearGradient>

      {/* Profile Picture */}
      <View style={styles.profilePicContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.profilePic}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Icon name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => handleChange("name", text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profile.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={profile.phone}
            onChangeText={(text) => handleChange("phone", text)}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F5F9" },

  headerContainer: {
    height: 140,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },

  profilePicContainer: {
    alignSelf: "center",
    marginTop: -50,
    position: "relative",
  },
  profilePic: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4F86F7",
    padding: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#fff",
  },

  infoContainer: {
    marginTop: 30,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },

  inputGroup: { marginBottom: 15 },
  label: { color: "#555", marginBottom: 5, fontWeight: "500" },
  input: {
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  saveBtn: {
    backgroundColor: "#4F86F7",
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#4F86F7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
