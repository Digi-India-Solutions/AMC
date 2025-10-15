import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Animated,
  Platform,
  Image,
  Dimensions,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import Drawer from '../components/uicomponents/Drawer'

const { width, height } = Dimensions.get("window");

const transactionsData = {
  amc: [
    { id: "1", description: "AMC – Premium Plan", amount: 1200, date: "2025-10-01", type: "debit", icon: "card" },
    { id: "2", description: "AMC – Basic Plan", amount: 700, date: "2025-08-15", type: "debit", icon: "card" },
    { id: "3", description: "AMC – Family Plan", amount: 2500, date: "2025-05-10", type: "debit", icon: "card" },
    { id: "4", description: "AMC – Student Plan", amount: 500, date: "2025-07-20", type: "debit", icon: "card" },
    { id: "5", description: "AMC – Senior Citizen Plan", amount: 800, date: "2025-09-10", type: "debit", icon: "card" },
  ],
  wallet: [
    { id: "1", description: "Wallet Recharge – Paytm", amount: 1000, date: "2025-10-10", type: "credit", icon: "wallet" },
    { id: "2", description: "Wallet Bonus – Cashback", amount: 150, date: "2025-09-20", type: "credit", icon: "gift" },
    { id: "3", description: "Wallet Refund – Order Cancelled", amount: 300, date: "2025-09-05", type: "credit", icon: "refresh" },
    { id: "4", description: "Wallet Transfer – Bank", amount: 2000, date: "2025-08-25", type: "credit", icon: "arrow-forward" },
    { id: "5", description: "Wallet Transfer – UPI", amount: 500, date: "2025-07-30", type: "credit", icon: "arrow-forward" },
  ],
};

export default function TransactionsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("amc");
  const [searchText, setSearchText] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [showDrawer, setShowDrawer] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  const openDrawer = () => {
    setShowDrawer(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.75,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setShowDrawer(false));
  };

  const filteredData = transactionsData[activeTab].filter((item) => {
    const matchSearch = item.description.toLowerCase().includes((searchText || "").toLowerCase());
    const matchType =
      transactionType === "all" ||
      (transactionType === "credit" && item.type === "credit") ||
      (transactionType === "debit" && item.type === "debit");
    const matchStart = startDate ? new Date(item.date) >= startDate : true;
    const matchEnd = endDate ? new Date(item.date) <= endDate : true;
    return matchSearch && matchType && matchStart && matchEnd;
  });

  const renderTransaction = ({ item, index }) => {
    const animation = new Animated.Value(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();

    const translateY = animation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
    const opacity = animation;

    return (
      <Animated.View style={[styles.transactionCard, { opacity, transform: [{ translateY }] }]}>
        <View style={styles.transactionRow}>
          <LinearGradient
            colors={item.type === "credit" ? ["#81C784", "#388E3C"] : ["#EF9A9A", "#C62828"]}
            style={styles.iconCircle}
          >
            <Icon name={item.icon} size={22} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
          <Text
            style={[
              styles.amount,
              { color: item.type === "credit" ? "#43A047" : "#E53935" },
            ]}
          >
            {item.type === "credit" ? "+" : "-"}₹{item.amount}
          </Text>
          <TouchableOpacity style={{ marginLeft: 12 }}>
            <Icon name="share-outline" size={22} color="#555" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={openDrawer}>
          <Icon name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/emicare.png")} style={{ height: 50, width: 150 }} />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
          <Image source={require("../assets/logo.png")} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <View style={styles.innerContainer}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {["amc", "wallet"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeTabText]}
              >
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Icon name="search" size={18} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          style={styles.filterButtonContainer}
          onPress={() => setFilterModalVisible(true)}
        >
          <LinearGradient colors={["#42A5F5", "#1E88E5"]} style={styles.filterButton}>
            <Icon name="options" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={{ color: "#fff", fontWeight: "600" }}>Filter</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Transaction List */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        {/* Filter Modal */}
        <Modal visible={filterModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Apply Filters</Text>

              {/* Transaction Type */}
              <Text style={styles.sectionTitle}>Transaction Type</Text>
              <View style={styles.typeButtonContainer}>
                {["all", "credit", "debit"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      transactionType === type && styles.typeButtonActive,
                    ]}
                    onPress={() => setTransactionType(type)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        transactionType === type && { color: "#fff" },
                      ]}
                    >
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Date Range */}
              <Text style={styles.sectionTitle}>Date Range</Text>
              <View style={styles.dateContainer}>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text>{startDate ? startDate.toDateString() : "Start Date"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text>{endDate ? endDate.toDateString() : "End Date"}</Text>
                </TouchableOpacity>
              </View>

              {showStartPicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={(e, date) => {
                    setShowStartPicker(false);
                    if (date) setStartDate(date);
                  }}
                />
              )}
              {showEndPicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={(e, date) => {
                    setShowEndPicker(false);
                    if (date) setEndDate(date);
                  }}
                />
              )}

              <View style={styles.modalActionButtons}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => {
                    setTransactionType("all");
                    setStartDate(null);
                    setEndDate(null);
                  }}
                >
                  <Text style={{ color: "#E53935", fontWeight: "bold" }}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/* Full-screen Drawer */}
      {showDrawer && (
        <>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width,
              height,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 998,
            }}
            activeOpacity={1}
            onPress={closeDrawer}
          />
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: width * 0.75,
              height,
              backgroundColor: "#fff",
              transform: [{ translateX: slideAnim }],
              zIndex: 999,
              elevation: 10,
              paddingTop: 0,
            }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Drawer />
            </ScrollView>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#F4F6FB" },
  innerContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  tabsContainer: { flexDirection: "row", marginBottom: 12 },
  tabButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#4CAF50",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: { fontWeight: "bold", color: "#555" },
  activeTabText: { color: "#fff" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#000" },
  filterButtonContainer: { alignItems: "flex-end", marginBottom: 12 },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
  },
  transactionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  transactionRow: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  description: { fontSize: 15, fontWeight: "600", color: "#222" },
  date: { fontSize: 12, color: "#888", marginTop: 2 },
  amount: { fontSize: 15, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  typeButtonContainer: { flexDirection: "row", marginBottom: 15 },
  typeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#EAEAEA",
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 10,
  },
  typeButtonActive: { backgroundColor: "#4CAF50" },
  typeButtonText: { fontWeight: "bold", color: "#444" },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  modalActionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E53935",
  },
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5, padding: 5 },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  profileImage: { width: 50, height: 50, borderRadius: 20 },
});
