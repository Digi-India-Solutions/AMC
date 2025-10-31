import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { getData, postData } from "../services/FetchNodeAdminServices";

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
    categoryId: "",
    brandId: "",
    typeId: "",
    purchaseProof: [],
    productPhotos: [],
  });

  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [finalAmount, setFinalAmount] = useState(0);

  const handleInput = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // -------------------- Fetch Data --------------------
  const fetchAllCategories = async () => {
    try {
      const response = await getData(`api/category/get-All-category`);
      if (response?.status) setAllCategories(response.data);
    } catch (error) {
      console.log("❌ Error fetching categories:", error);
    }
  };

  const fetchAllBrandsByCategory = async () => {
    if (!form.categoryId) return;
    try {
      const response = await getData(`api/brand/get-brand-by-category/${form.categoryId}`);
      if (response?.status) setAllBrands(response.data);
    } catch (error) {
      console.log("❌ Error fetching brands:", error);
    }
  };

  const fetchAllTypesByBrand = async () => {
    if (!form.brandId) return;
    try {
      const response = await getData(`api/type/get-type-by-brand/${form.brandId}`);
      if (response?.status) setAllTypes(response.data);
    } catch (error) {
      console.log("❌ Error fetching types:", error);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    fetchAllBrandsByCategory();
  }, [form.categoryId]);

  useEffect(() => {
    fetchAllTypesByBrand();
  }, [form.brandId]);

  // -------------------- Upload Bill --------------------
  const pickUploadBill = () => {
    Alert.alert("Upload Bill", "Choose source", [
      {
        text: "Camera",
        onPress: () => {
          launchCamera({ mediaType: "photo" }, (response) => {
            if (!response.didCancel && response.assets?.length > 0) {
              const file = response.assets[0];
              const newFile = {
                uri: file.uri,
                type: file.type || "image/jpeg",
                name: file.fileName || `bill_${Date.now()}.jpg`,
              };
              setForm((prev) => ({
                ...prev,
                purchaseProof: [...prev.purchaseProof, newFile],
              }));
            }
          });
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          launchImageLibrary({ mediaType: "photo", selectionLimit: 5 }, (response) => {
            if (!response.didCancel && response.assets?.length > 0) {
              const files = response.assets.map((f) => ({
                uri: f.uri,
                type: f.type || "image/jpeg",
                name: f.fileName || `bill_${Date.now()}.jpg`,
              }));
              setForm((prev) => ({
                ...prev,
                purchaseProof: [...prev.purchaseProof, ...files],
              }));
            }
          });
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // -------------------- Upload Product Photos --------------------
  const pickProductPhotos = async () => {
    // Alert.alert("Upload Product Photos", "Choose source", [
    //   {
    //     text: "Camera",
    //     onPress: () => {
    //       launchCamera({ mediaType: "photo" }, (response) => {
    //         if (!response.didCancel && response.assets?.length > 0) {
    //           const file = response.assets[0];
    //           const newFile = {
    //             uri: file.uri,
    //             type: file.type || "image/jpeg",
    //             name: file.fileName || `product_${Date.now()}.jpg`,
    //           };
    //           setForm((prev) => ({
    //             ...prev,
    //             productPhotos: [...prev.productPhotos, newFile],
    //           }));
    //         }
    //       });
    //     },
    //   },
    //   {
    //     text: "Gallery",
    //     onPress: () => {
    //       launchImageLibrary({ mediaType: "photo", selectionLimit: 5 }, (response) => {
    //         if (!response.didCancel && response.assets?.length > 0) {
    //           const files = response.assets.map((f) => ({
    //             uri: f.uri,
    //             type: f.type || "image/jpeg",
    //             name: f.fileName || `product_${Date.now()}.jpg`,
    //           }));
    //           setForm((prev) => ({
    //             ...prev,
    //             productPhotos: [...prev.productPhotos, ...files],
    //           }));
    //         }
    //       });
    //     },
    //   },
    //   { text: "Cancel", style: "cancel" },
    // ]);
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) return;

    const file = result.assets[0];

    const fileData = {
      uri: file.uri,
      name: file.fileName,
      type: file.type,
    }
    setForm((prev) => ({
      ...prev,
      productPhotos: [...prev.productPhotos, fileData],
    }));
  };

  // -------------------- GST Calculation --------------------
  useEffect(() => {
    const value = parseFloat(form.purchaseValue) || 0;
    setFinalAmount(value + value * 0.18);
  }, [form.purchaseValue]);

  // -------------------- Submit --------------------
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.mobile || !form.address) {
      Alert.alert("Validation", "Please fill all required fields");
      return;
    }

    const category = allCategories.find((c) => c._id === form.categoryId);
    const brand = allBrands.find((b) => b._id === form.brandId);
    const type = allTypes.find((t) => t._id === form.typeId);

    const formData = new FormData();
    formData.append("customerName", form.name);
    formData.append("customerEmail", form.email);
    formData.append("customerMobile", form.mobile);
    formData.append("customerAddress", form.address);
    formData.append("serialNumber", form.imei);
    formData.append("categoryId", form.categoryId);
    formData.append("brandId", form.brandId);
    formData.append("typeId", form.typeId);

    if (category) formData.append("category", category.name);
    if (brand) formData.append("brand", brand.name);
    if (type) formData.append("type", type.name);

    formData.append("model", form.model);
    formData.append("purchaseValue", form.purchaseValue);
    formData.append("amcAmount", finalAmount);

    form.purchaseProof.forEach((file, i) =>
      formData.append("purchaseProof", {
        uri: file.uri,
        type: file.type,
        name: file.name || `bill_${i}.jpg`,
      })
    );
    form.productPhotos.forEach((file, i) =>
      formData.append("productPhotos", {
        uri: file.uri,
        type: file.type,
        name: file.name || `product_${i}.jpg`,
      })
    );

    try {
      const result = await postData("api/amcs/create-amc-by-admin", formData, true);
      if (result?.status) {
        Alert.alert("✅ Success", "WEC Created Successfully!");
        navigation.goBack();
      } else {
        Alert.alert("❌ Error", result?.message || "Failed to create WEC");
      }
    } catch (error) {
      console.log("❌ Error submitting form:", error);
      Alert.alert("Error", "Something went wrong while submitting");
    }
  };

  // -------------------- UI --------------------
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: makeScale(15) }}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>Create New WEC</Text>
        </View>

        {/* Customer Info */}
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

        {/* Serial + Upload Bill */}
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
            <Text style={styles.label}>Upload Bill</Text>
            <TouchableOpacity style={styles.fileButton} onPress={pickUploadBill}>
              <Text style={styles.fileText}>Choose Bill</Text>
            </TouchableOpacity>
            <ScrollView horizontal style={{ marginTop: 10 }}>
              {form.purchaseProof.map((bill, i) => (
                <View key={i} style={styles.photoWrapper}>
                  <Image source={{ uri: bill.uri }} style={styles.productPhoto} />
                  <TouchableOpacity
                    style={styles.removePhotoBtn}
                    onPress={() => {
                      const updated = [...form.purchaseProof];
                      updated.splice(i, 1);
                      setForm({ ...form, purchaseProof: updated });
                    }}
                  >
                    <Text style={styles.removePhotoText}>✖</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Product Photos */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Upload Product Photos</Text>
          <TouchableOpacity style={styles.fileButton} onPress={pickProductPhotos}>
            <Text style={styles.fileText}>Choose Products...</Text>
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {form.productPhotos.map((img, idx) => (
              <View key={idx} style={styles.photoWrapper}>
                <Image source={{ uri: img.uri }} style={styles.productPhoto} />
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={() => {
                    const updated = [...form.productPhotos];
                    updated.splice(idx, 1);
                    setForm({ ...form, productPhotos: updated });
                  }}
                >
                  <Text style={styles.removePhotoText}>✖</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <Text style={styles.sectionTitle}>Product Information</Text>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <Picker
              selectedValue={form.categoryId}
              style={styles.picker}
              onValueChange={(v) => handleInput("categoryId", v)}
            >
              <Picker.Item label="Select Category" value="" />
              {allCategories.map((item) => (
                <Picker.Item key={item._id} label={item?.name} value={item?._id} />
              ))}
            </Picker>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Brand *</Text>
            <Picker
              selectedValue={form.brandId}
              style={styles.picker}
              onValueChange={(v) => handleInput("brandId", v)}
            >
              <Picker.Item label="Select Brand" value="" />
              {allBrands.map((item) => (
                <Picker.Item key={item._id} label={item.name} value={item._id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type *</Text>
            <Picker
              selectedValue={form.typeId}
              style={styles.picker}
              onValueChange={(v) => handleInput("typeId", v)}
            >
              <Picker.Item label="Select Type" value="" />
              {allTypes.map((item) => (
                <Picker.Item key={item._id} label={item.name} value={item._id} />
              ))}
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

      {/* Bottom Bar */}
      <View style={styles.bottomContainer}>
        <View style={styles.finalAmountContainer}>
          <Text style={styles.finalAmountLabel}>WEC Amount (incl. 18% GST)</Text>
          <Text style={styles.finalAmountValue}>₹{finalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleSubmit}>
            <Text style={[styles.buttonText, { color: "#fff" }]}>Create WEC</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: makeScale(15) },
  backButton: { marginRight: makeScale(10) },
  header: { fontSize: makeScale(22), fontWeight: "bold" },
  sectionTitle: { fontSize: makeScale(16), fontWeight: "600", marginVertical: makeScale(8) },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputGroup: { width: "48%", marginBottom: makeScale(10) },
  label: { fontSize: makeScale(12), fontWeight: "500", color: "#555" },
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
  fileText: { color: "#007BFF", fontWeight: "500", textAlign: "center" },
  photoWrapper: { position: "relative", marginRight: makeScale(8) },
  productPhoto: { width: makeScale(50), height: makeScale(50), borderRadius: 8 },
  removePhotoBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF4444",
    width: makeScale(20),
    height: makeScale(20),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  removePhotoText: { color: "#fff", fontSize: makeScale(12), fontWeight: "700" },
  bottomContainer: {
    padding: makeScale(15),
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  finalAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: makeScale(10),
  },
  finalAmountLabel: {
    fontSize: makeScale(14),
    color: "#555",
    fontWeight: "500",
  },
  finalAmountValue: {
    fontSize: makeScale(16),
    fontWeight: "700",
    color: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: "48%",
    paddingVertical: makeScale(12),
    borderRadius: makeScale(8),
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  createButton: {
    backgroundColor: "#007BFF",
  },
  buttonText: {
    fontSize: makeScale(14),
    fontWeight: "600",
    color: "#000",
  },
});
