import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  StatusBar,
  Platform,
  Modal,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../components/uicomponents/Header";

const transactionsData = {
  wec: [
    { id: "1", name: "Rohit Raj", type: "User", email: "rohit@test.com", item: "AC", balance: 500, date: "2025-10-01" },
    { id: "2", name: "Priya Singh", type: "Vendor", email: "priya@test.com", item: "LED TV", balance: 1500, date: "2025-10-02" },
    { id: "3", name: "Amit Verma", type: "User", email: "amit@test.com", item: "Washing Machine", balance: 2000, date: "2025-09-25" },
    { id: "4", name: "Deepak Singh", type: "User", email: "deepak@test.com", item: "Refrigerator", balance: 2000, date: "2025-08-15" },
    { id: "5", name: "Rahul", type: "Vendor", email: "rahul@test.com", item: "Cooler", balance: 5000, date: "2025-07-10" },
    { id: "6", name: "Somya", type: "User", email: "somya@test.com", item: "Microwave", balance: 3000, date: "2025-06-20" },
  ],
  wallet: [
    { id: "1", description: "Wallet Recharge – Paytm", amount: 1000, date: "2025-10-10", type: "credit", icon: "wallet" },
    { id: "2", description: "Wallet Bonus – Cashback", amount: 150, date: "2025-09-20", type: "credit", icon: "gift" },
    { id: "3", description: "Wallet Refund – Order Cancelled", amount: 300, date: "2025-09-05", type: "debit", icon: "refresh" },
  ],
};

// WEC Transaction item with animation
const WecTransactionItem = ({ item, index }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] });

  return (
    <Animated.View style={[styles.userTransactionCard, { opacity: anim, transform: [{ translateY }] }]}>
      <LinearGradient colors={["#42A5F5", "#1E88E5"]} style={styles.userIconCircle}>
        <Icon name={item.type === "User" ? "person" : "business"} size={22} color="#fff" />
      </LinearGradient>

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.description}>
          {item.name} <Text style={{ color: "#777", fontSize: 13 }}>• {item.item}</Text>
        </Text>
        <Text style={styles.date}>{item.email}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={[styles.amount, { color: "#E53935" }]}>-₹{item.balance.toLocaleString()}</Text>
      </View>
    </Animated.View>
  );
};

// Wallet transaction item
const WalletTransactionItem = ({ item }) => (
  <View style={styles.transactionCard}>
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
      <Text style={[styles.amount, { color: item.type === "credit" ? "#43A047" : "#E53935" }]}>
        {item.type === "credit" ? "+" : "-"}₹{item.amount}
      </Text>
      <TouchableOpacity style={{ marginLeft: 12 }}>
        <Icon name="share-outline" size={22} color="#555" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("wec");
  const [searchText, setSearchText] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const filteredData = transactionsData[activeTab].filter((item) => {
    const matchSearch = activeTab === "wallet"
      ? item.description.toLowerCase().includes((searchText || "").toLowerCase())
      : item.name.toLowerCase().includes((searchText || "").toLowerCase());

    const matchType =
      transactionType === "all" ||
      (transactionType === "credit" && item.type === "credit") ||
      (transactionType === "debit" && item.type === "debit");

    const matchStart = startDate ? new Date(item.date) >= startDate : true;
    const matchEnd = endDate ? new Date(item.date) <= endDate : true;

    return matchSearch && matchType && matchStart && matchEnd;
  });

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F7F8FA"
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        translucent={false}
      />

      <View style={{ paddingTop: Platform.OS === "ios" ? insets.top : 0 }}>
        <Header />
      </View>

      <View style={styles.divider} />

      <View style={styles.innerContainer}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {["wec", "wallet"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
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
            placeholder={activeTab === "wallet" ? "Search transactions..." : "Search users..."}
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
        {activeTab === "wec" ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <WecTransactionItem item={item} index={index} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <WalletTransactionItem item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        {/* Filter Modal */}
        <Modal visible={filterModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Apply Filters</Text>

              <Text style={styles.sectionTitle}>Transaction Type</Text>
              <View style={styles.typeButtonContainer}>
                {["all", "credit", "debit"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeButton, transactionType === type && styles.typeButtonActive]}
                    onPress={() => setTransactionType(type)}
                  >
                    <Text style={[styles.typeButtonText, transactionType === type && { color: "#fff" }]}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Date Range</Text>
              <View style={styles.dateContainer}>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
                  <Text>{startDate ? startDate.toDateString() : "Start Date"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
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
                  style={styles.cancelButton}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={{ color: "#555", fontWeight: "bold" }}>Cancel</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FB" },
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
  activeTab: { backgroundColor: "#4CAF50", elevation: 4 },
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
  iconCircle: { width: 40, height: 40, borderRadius: 20, marginRight: 10, justifyContent: "center", alignItems: "center" },
  description: { fontSize: 15, fontWeight: "600", color: "#222" },
  date: { fontSize: 12, color: "#888", marginTop: 2 },
  amount: { fontSize: 15, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#E0E0E0" },
  userTransactionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  userIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 16, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  typeButtonContainer: { flexDirection: "row", marginBottom: 15 },
  typeButton: { flex: 1, padding: 12, backgroundColor: "#EAEAEA", alignItems: "center", marginHorizontal: 4, borderRadius: 10 },
  typeButtonActive: { backgroundColor: "#4CAF50" },
  typeButtonText: { fontWeight: "bold", color: "#444" },
  dateContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  dateButton: { flex: 1, padding: 12, backgroundColor: "#F5F5F5", alignItems: "center", borderRadius: 10, marginHorizontal: 5 },
  modalActionButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  applyButton: { flex: 1, backgroundColor: "#2196F3", padding: 14, borderRadius: 10, alignItems: "center", marginLeft: 5 },
  resetButton: { flex: 1, backgroundColor: "#fff", padding: 14, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#E53935", marginRight: 5 },
  cancelButton: { flex: 1, backgroundColor: "#E0E0E0", padding: 14, borderRadius: 10, alignItems: "center", marginHorizontal: 5 },
});
