// 🟢 Full Updated Code — WalletManagement.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  FlatList,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import Header from "../components/uicomponents/Header";
import { getData } from "../services/FetchNodeAdminServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const makeScale = (value) => (value * width) / 375;

export default function WalletManagement({ navigation }) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retailers, setRetailers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionUserId, setTransactionUserId] = useState([]);

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);

  const [selectedTab, setSelectedTab] = useState("Wallet");
  const [search, setSearch] = useState("");

  // 🟢 Debug: Show AsyncStorage content (optional)
  const debugAsyncStorage = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    console.log("📦 AsyncStorage Content:", values);
  };

  // 🟢 Load user info from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ Loaded userData:", parsedUser);
          setUserId(parsedUser?.user || parsedUser);
        } else {
          console.log("⚠️ No user data found in AsyncStorage");
        }
      } catch (e) {
        console.log("❌ Error loading AsyncStorage user:", e);
      }
    };
    loadUserData();
    debugAsyncStorage();
  }, []);

  useEffect(() => {
    if (userId?._id) {
      fetchWalletManagement();
      fetchRetailers();
      fetchTransactions();
    }
  }, [userId]);

  // 🟢 Fetch wallet details
  const fetchWalletManagement = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching wallet for userId:", userId?._id);

      const response = await getData(`api/transaction/getWalletManagementByAdmin/${userId?._id}`);
      console.log("💰 Wallet Response:", response);

      if (response?.status) {
        setTotalBalance(response.totalBalance || 0);
        setTotalCredit(response.totalCredit || 0);
        setTotalDebit(response.totalDebit || 0);
      } else {
        console.log("⚠️ Wallet API returned invalid data");
      }
    } catch (e) {
      console.log("❌ Wallet API Error:", e);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Fetch retailers under this admin
  const fetchRetailers = async () => {
    try {
      const query = new URLSearchParams({
        role: userId?.role,
        createdByEmail: userId?.email || "",
        userId: userId?._id,
      }).toString();

      const response = await getData(`api/admin/getRetailersByDistributorwithPagination?${query}`);
      console.log("🛒 Retailers Response:", response);

      if (response?.status) {
        setRetailers(response.data);
        const ids = response.data.map((r) => r._id);
        setTransactionUserId([...new Set([...transactionUserId, ...ids])]);
      }
    } catch (e) {
      console.log("❌ Retailer fetch error:", e);
    }
  };

  // 🟢 Fetch transactions
  const fetchTransactions = async () => {
    try {
      const params = {
        role: userId?.role || "",
        createdByEmail: userId?.email || "",
      };

      if (retailers.length > 0) {
        params.userId = JSON.stringify(transactionUserId);
      }

      const query = new URLSearchParams(params).toString();
      const response = await getData(`api/transaction/get-transaction-by-admin-with-pagination?${query}`);
      console.log("💳 Transaction Response:", response);

      if (response?.status) {
        setTransactions(response.data);
      }
    } catch (e) {
      console.log("❌ Transaction fetch error:", e);
    }
  };

  // 🟢 Animation setup
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🟢 Added formatDate helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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

  // 🟢 Filter data by search
  const filteredData =
    selectedTab === "Wallet"
      ? retailers.filter((u) => u?.name?.toLowerCase()?.includes(search?.toLowerCase()))
      : transactions.filter((t) => t?.description?.toLowerCase()?.includes(search?.toLowerCase()));

  // 🟢 Render transaction
  const renderTransaction = ({ item, index }) => {
    const anim = new Animated.Value(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View
        style={[
          styles.transactionCard,
          {
            opacity: anim,
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }],
          },
        ]}
      >
        <View style={styles.transactionRow}>
          <LinearGradient
            colors={item.type === "credit" ? ["#81C784", "#388E3C"] : ["#EF9A9A", "#C62828"]}
            style={styles.iconCircle}
          >
            <Icon name={item.icon || "swap-vertical"} size={22} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.description}>{item?.description || "No description"}</Text>
            {/* 🟢 Updated date line */}
            <Text style={styles.date}>{formatDate(item?.createdDate || item?.createdAt)}</Text>
          </View>
          <Text style={[styles.amount, { color: item.type === "credit" ? "#43A047" : "#E53935" }]}>
            {item.type === "credit" ? "+" : "-"}₹{item.amount}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F7F8FA" barStyle="dark-content" />
      <View style={{ paddingTop: Platform.OS === "ios" ? insets.top : 0 }}>
        <Header />
      </View>
      <View style={styles.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: makeScale(10), paddingBottom: 100 }}
      >
        <Text style={styles.header}>Wallet Management</Text>

        {/* 🟢 Summary Cards */}
        <View style={styles.cardContainer}>
          {renderSummaryCard("Total Balance", totalBalance, "#00C853", "wallet")}
          {renderSummaryCard("Total Credits", totalCredit, "#2979FF", "arrow-up-circle")}
        </View>
        <View style={styles.cardContainer}>
          {renderSummaryCard("Total Debits", totalDebit, "#D50000", "arrow-down-circle")}
          {renderSummaryCard("Transactions", transactions.length, "#FFA000", "receipt")}
        </View>

        {/* 🟢 Tabs */}
        <View style={styles.tabContainer}>
          {["Wallet", "All Transactions"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🟢 Search */}
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

        {/* 🟢 Loader */}
        {loading && <ActivityIndicator size="large" color="#2979FF" style={{ marginVertical: 20 }} />}

        {/* 🟢 Main Data View */}
        {!loading &&
          (selectedTab === "Wallet" ? (
            filteredData.length > 0 ? (
              <FlatList
                data={filteredData}
                keyExtractor={(item) => item?._id?.toString()}
                renderItem={({ item }) => (
                  <View style={styles.userTransactionCard}>
                    <LinearGradient colors={["#42A5F5", "#1E88E5"]} style={styles.userIconCircle}>
                      <Icon name={item.type === "User" ? "person" : "business"} size={22} color="#fff" />
                    </LinearGradient>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.description}>
                        {item.name}
                        <Text style={{ color: "#777", fontSize: 13 }}> • {item?.item}</Text>
                      </Text>
                      <Text style={styles.date}>{item?.email}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={[styles.amount, { color: "rgb(22, 163, 74)" }]}>
                        ₹{item?.walletBalance?.toLocaleString() || 0}
                      </Text>
                    </View>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.noData}>No users found.</Text>
            )
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item?._id?.toString()}
              renderItem={renderTransaction}
              showsVerticalScrollIndicator={false}
            />
          ))}
      </ScrollView>
    </View>
  );
}

// 🟢 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  divider: { height: 1, backgroundColor: "#E0E0E0" },
  header: { fontSize: makeScale(22), fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  cardContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    elevation: 2,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 13, color: "#666" },
  cardValue: { fontSize: 20, fontWeight: "700" },
  iconBox: { padding: 10, borderRadius: 10 },
  tabContainer: { flexDirection: "row", marginTop: 5, marginBottom: 10 },
  tab: { marginRight: 20, paddingBottom: 6, borderBottomWidth: 2, borderBottomColor: "transparent" },
  activeTab: { borderBottomColor: "#2979FF" },
  tabText: { fontSize: 14, color: "#666" },
  activeTabText: { color: "#2979FF", fontWeight: "600" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#000" },
  transactionCard: { backgroundColor: "#fff", padding: 16, borderRadius: 14, marginBottom: 12, elevation: 3 },
  transactionRow: { flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 40, height: 40, borderRadius: 20, marginRight: 10, justifyContent: "center", alignItems: "center" },
  description: { fontSize: 15, fontWeight: "600", color: "#222" },
  date: { fontSize: 12, color: "#888", marginTop: 2 },
  amount: { fontSize: 15, fontWeight: "bold" },
  noData: { textAlign: "center", marginTop: 20, color: "#999" },
  userTransactionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  userIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
});
