import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Animated,
  FlatList,
  StatusBar,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import Drawer from "../components/uicomponents/Drawer";
import Header from "../components/uicomponents/Header";

const { width, height } = Dimensions.get("window");
const makeScale = (value) => (value * width) / 375;

const dummyWallet = {
  totalBalance: 0,
  totalCredits: 125500,
  totalDebits: 5000,
  users: [
    { id: 1, name: "Rohit Raj", type: "User", email: "rohit@test.com", balance: 500, status: "Active" },
    { id: 2, name: "Priya Singh", type: "Vendor", email: "priya@test.com", balance: 1500, status: "Inactive" },
    { id: 3, name: "Amit Verma", type: "User", email: "amit@test.com", balance: 2000, status: "Active" },
    { id: 4, name: "Deepak Singh", type: "User", email: "deepak@test.com", balance: 2000, status: "Active" },
    { id: 5, name: "Rahul ", type: "Vendor", email: "rahul@test.com", balance: 5000, status: "Active" },
    { id: 6, name: "Somya", type: "User", email: "somya@test.com", balance: 3000, status: "Inactive" },
  ],
  transactions: [
    { id: 1, name: "Wallet Top-Up", type: "credit", date: "2025-10-01", amount: 1000, icon: "wallet" },
    { id: 2, name: "Purchase – Grocery", type: "debit", date: "2025-10-02", amount: 500, icon: "cart" },
    { id: 3, name: "Refund – Order #2435", type: "credit", date: "2025-09-25", amount: 300, icon: "refresh" },
    { id: 4, name: "Transfer – Bank", type: "debit", date: "2025-08-15", amount: 2000, icon: "arrow-forward" },
  ],
};

export default function WalletManagement({ navigation }) {
  const insets = useSafeAreaInsets();
  const [wallet] = useState(dummyWallet);
  const [selectedTab, setSelectedTab] = useState("Wallet Balances");
  const [search, setSearch] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderSummaryCard = (title, value, color, icon) => (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor: color + "33",
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.cardRow}>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={[styles.cardValue, { color }]}>{`₹${value.toLocaleString()}`}</Text>
        </View>
        <View style={[styles.iconBox, { backgroundColor: color }]}>
          <Icon name={icon} size={makeScale(20)} color="#fff" />
        </View>
      </View>
    </Animated.View>
  );

  const filteredData =
    selectedTab === "Wallet Balances"
      ? wallet.users.filter((u) =>
          u.name.toLowerCase().includes(search.toLowerCase())
        )
      : wallet.transactions.filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        );

  const renderTransaction = ({ item, index }) => {
    const anim = new Animated.Value(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();

    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 0],
    });

    return (
      <Animated.View
        style={[
          styles.transactionCard,
          { opacity: anim, transform: [{ translateY }] },
        ]}
      >
        <View style={styles.transactionRow}>
          <LinearGradient
            colors={
              item.type === "credit"
                ? ["#81C784", "#388E3C"]
                : ["#EF9A9A", "#C62828"]
            }
            style={styles.iconCircle}
          >
            <Icon name={item.icon} size={22} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.description}>{item.name}</Text>
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
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
          {/* ✅ Status Bar */}
          <StatusBar
            backgroundColor="#F7F8FA"
            barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
            translucent={false}
          />
    
          {/* ✅ Header (no extra top padding now) */}
          <View style={{ paddingTop: Platform.OS === "ios" ? insets.top : 0 }}>
            <Header />
          </View>
    
          {/* ✅ Divider below header */}
          <View style={styles.divider} />
    

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text style={styles.header}>Wallet Management</Text>

        {/* Summary Cards */}
        <View style={styles.cardContainer}>
          {renderSummaryCard("Total Balance", wallet.totalBalance, "#00C853", "wallet")}
          {renderSummaryCard("Total Credits", wallet.totalCredits, "#2979FF", "arrow-up-circle")}
        </View>
        <View style={styles.cardContainer}>
          {renderSummaryCard("Total Debits", wallet.totalDebits, "#D50000", "arrow-down-circle")}
          {renderSummaryCard("Transactions", wallet.transactions.length, "#FFA000", "receipt")}
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {["Wallet Balances", "Transactions"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} color="#777" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
        </View>

       {selectedTab === "Wallet Balances" ? (
  filteredData.length > 0 ? (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => {
        const anim = new Animated.Value(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: index * 80,
          useNativeDriver: true,
        }).start();

        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [15, 0],
        });

        return (
          <Animated.View
            style={[
              styles.userTransactionCard,
              { opacity: anim, transform: [{ translateY }] },
            ]}
          >
            <LinearGradient
              colors={["#42A5F5", "#1E88E5"]}
              style={styles.userIconCircle}
            >
              <Icon
                name={item.type === "User" ? "person" : "business"}
                size={22}
                color="#fff"
              />
            </LinearGradient>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.description}>{item.name}</Text>
              <Text style={styles.date}>{item.type} • {item.email}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.amount, { color: "#1E88E5" }]}>
                ₹{item.balance.toLocaleString()}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  color: item.status === "Active" ? "#00C853" : "#D32F2F",
                  fontWeight: "600",
                  fontSize: 12,
                }}
              >
                {item.status}
              </Text>
            </View>
          </Animated.View>
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  ) : (
    <Text style={styles.noData}>No users found.</Text>
  )
) : (
  <FlatList
    data={filteredData}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderTransaction}
    showsVerticalScrollIndicator={false}
  />
)}

      </ScrollView>

      {/* Drawer */}
      {showDrawer && (
        <>
          <TouchableOpacity style={styles.overlay} onPress={closeDrawer} />
          <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
            <ScrollView>
              <Drawer />
            </ScrollView>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: makeScale(10) },
  divider: { height: 1, backgroundColor: "#E0E0E0" },
  header: { fontSize: makeScale(22), fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },

  cardContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  card: { width: "48%", backgroundColor: "#fff", borderRadius: 12, padding: 15, borderWidth: 1, borderColor: "#E0E0E0", elevation: 2 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 13, color: "#666" },
  cardValue: { fontSize: 20, fontWeight: "700" },
  iconBox: { padding: 10, borderRadius: 10 },

  tabContainer: { flexDirection: "row", marginTop: 5, marginBottom: 10 },
  tab: { marginRight: 20, paddingBottom: 6, borderBottomWidth: 2, borderBottomColor: "transparent" },
  activeTab: { borderBottomColor: "#2979FF" },
  tabText: { fontSize: 14, color: "#666" },
  activeTabText: { color: "#2979FF", fontWeight: "600" },

  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, borderWidth: 1, borderColor: "#ddd", elevation: 1 },
  searchInput: { flex: 1, fontSize: 14, color: "#000" },

  // Transaction styling (similar to TransactionScreen)
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

  // Wallet Balances style
  userCard: { backgroundColor: "#fff", borderRadius: 12, padding: 15, elevation: 2, marginBottom: 10 },
  boxName: { fontSize: 16, fontWeight: "700" },
  boxType: { fontSize: 13, color: "#555", marginTop: 2 },
  boxEmail: { fontSize: 12, color: "#777", marginTop: 2 },
  boxBalance: { fontSize: 16, fontWeight: "700", marginTop: 8 },
  boxStatus: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  noData: { textAlign: "center", marginTop: 20, color: "#999" },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 998 },
  drawer: { position: "absolute", top: 0, left: 0, width: width * 0.75, height, backgroundColor: "#fff", zIndex: 999, elevation: 10 },
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
userIconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
},
}); 
  