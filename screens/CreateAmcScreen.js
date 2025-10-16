import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = require("react-native").Dimensions.get("window");
const makeScale = (v) => (v * width) / 375;

export default function CreateAmcScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    imei: "",
    category: "",
    brand: "",
    type: "",
    model: "",
    purchaseValue: "",
    proof: null,
  });

  const [finalAmount, setFinalAmount] = useState(0);

  const handleInput = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickFile = async () => {
    Alert.alert(
      "Upload Purchase Proof",
      "Simulated file upload (no actual file picker).",
      [{ text: "OK", onPress: () => setForm({ ...form, proof: { name: "purchase_proof.pdf" } }) }]
    );
  };

  useEffect(() => {
    const value = parseFloat(form.purchaseValue) || 0;
    const tax = value * 0.18; // Example: 18% tax
    setFinalAmount(value + tax);
  }, [form.purchaseValue]);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.mobile || !form.address) {
      Alert.alert("Validation", "Please fill all required fields");
      return;
    }
    Alert.alert("AMC Created", "Your AMC has been successfully created.");
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: makeScale(15) }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>Create New AMC</Text>
        </View>

        {/* Customer Information */}
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter customer name"
              value={form.name}
              onChangeText={(v) => handleInput("name", v)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter customer email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(v) => handleInput("email", v)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Mobile *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter customer mobile"
              keyboardType="phone-pad"
              value={form.mobile}
              onChangeText={(v) => handleInput("mobile", v)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Address *</Text>
            <TextInput
              style={[styles.input, { height: makeScale(60) }]}
              placeholder="Enter customer address"
              multiline
              value={form.address}
              onChangeText={(v) => handleInput("address", v)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Serial / IMEI Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter serial / imei"
              value={form.imei}
              onChangeText={(v) => handleInput("imei", v)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Upload Purchase Proof</Text>
            <TouchableOpacity style={styles.fileButton} onPress={pickFile}>
              <Text style={styles.fileText}>{form.proof ? form.proof.name : "Choose File"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Information */}
        <Text style={styles.sectionTitle}>Product Information</Text>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <Picker
              selectedValue={form.category}
              style={styles.picker}
              onValueChange={(v) => handleInput("category", v)}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Electronics" value="electronics" />
              <Picker.Item label="Appliance" value="appliance" />
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Brand *</Text>
            <Picker
              selectedValue={form.brand}
              style={styles.picker}
              onValueChange={(v) => handleInput("brand", v)}
            >
              <Picker.Item label="Select Brand" value="" />
              <Picker.Item label="Samsung" value="samsung" />
              <Picker.Item label="LG" value="lg" />
            </Picker>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type *</Text>
            <Picker
              selectedValue={form.type}
              style={styles.picker}
              onValueChange={(v) => handleInput("type", v)}
            >
              <Picker.Item label="Select Type" value="" />
              <Picker.Item label="Washing Machine" value="wm" />
              <Picker.Item label="Refrigerator" value="fridge" />
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Model *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter model"
              value={form.model}
              onChangeText={(v) => handleInput("model", v)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purchase Value *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter value"
              value={form.purchaseValue}
              onChangeText={(v) => handleInput("purchaseValue", v)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Final Amount + Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.finalAmountContainer}>
          <Text style={styles.finalAmountLabel}>Final Amount (incl. 18% GST)</Text>
          <Text style={styles.finalAmountValue}>₹{finalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleSubmit}>
            <Text style={[styles.buttonText, { color: "#fff" }]}>Create AMC</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: makeScale(15) },
  backButton: { marginRight: makeScale(10) },
  header: { fontSize: makeScale(22), fontWeight: "bold" },
  sectionTitle: { fontSize: makeScale(16), fontWeight: "600", marginVertical: makeScale(8) },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputGroup: { width: "48%", marginBottom: makeScale(10) },
  label: { fontSize: makeScale(13), fontWeight: "500", color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: makeScale(8),
    padding: makeScale(8),
    marginTop: makeScale(4),
    backgroundColor: "#fff",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: makeScale(8),
    backgroundColor: "#fff",
    marginTop: makeScale(4),
  },
  fileButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: makeScale(8),
    padding: makeScale(10),
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  fileText: { color: "#007BFF", fontWeight: "500" },
  bottomContainer: {
    padding: makeScale(15),
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  finalAmountContainer: {
    backgroundColor: "#E8F0FE",
    borderRadius: makeScale(10),
    padding: makeScale(12),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4F86F7",
    marginBottom: makeScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  finalAmountLabel: { fontSize: makeScale(14), fontWeight: "500", color: "#555" },
  finalAmountValue: { fontSize: makeScale(18), fontWeight: "700", color: "#007BFF", marginTop: makeScale(4) },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end" },
  button: { paddingVertical: makeScale(10), paddingHorizontal: makeScale(18), borderRadius: makeScale(8), marginLeft: makeScale(10) },
  cancelButton: { backgroundColor: "#E0E0E0" },
  createButton: { backgroundColor: "#007BFF" },
  buttonText: { fontSize: makeScale(15), fontWeight: "600" },
});
 