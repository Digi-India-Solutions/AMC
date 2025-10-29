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
  ActivityIndicator,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import Header from "../components/uicomponents/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData } from "../services/FetchNodeAdminServices";

// 🔹 WEC Transaction Card
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
      <LinearGradient colors={["#42A5F5", "#1E88E5"]} style={styles.userIconCircle}>
        <Icon name="business" size={22} color="#fff" />
      </LinearGradient>

      <View style={{ flex: 1, marginLeft: 10 }}>
        {/* <Text style={styles.description}>{item.name || "Unknown User"}</Text>
        <Text style={styles.date}>{item.email || "No email"}</Text> */}

        {item.description ? (
          <Text style={[styles.description, { color: "#333", marginTop: 4 }]}>
            {item.description}
          </Text>
        ) : null}



        {item.createdAt ? (
          <Text style={[styles.date, { marginTop: 2 }]}>
            {new Date(item.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        ) : null}
      </View>

      <Text style={[styles.amount, { color: "#E53935" }]}>
        -₹{item.amount || 0}
      </Text>
    </Animated.View>
  );
};

// 🔹 Wallet Transaction Card
const WalletTransactionItem = ({ item }) => (
  <View style={styles.transactionCard}>
    <View style={styles.transactionRow}>
      <LinearGradient
        colors={item.type === "credit" ? ["#81C784", "#388E3C"] : ["#EF9A9A", "#C62828"]}
        style={styles.iconCircle}
      >
        <Icon name={item.type === "credit" ? "wallet" : "cash"} size={22} color="#fff" />
      </LinearGradient>

      <View style={{ flex: 1 }}>
        <Text style={styles.description}>{item.description || "No Description"}</Text>
        <Text style={styles.date}>
          {item.createdAt
            ? new Date(item.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            : ""}
        </Text>
      </View>

      <Text
        style={[
          styles.amount,
          { color: item.type === "credit" ? "#43A047" : "#E53935" },
        ]}
      >
        {item.type === "credit" ? "+" : "-"}₹{item.amount || 0}
      </Text>
    </View>
  </View>
);

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("wec");
  const [searchText, setSearchText] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wecData, setWecData] = useState([]);
  const [walletData, setWalletData] = useState([]);

  // 🟢 Load User from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const user = parsed?.user || parsed;
          setUserId(user);
        }
      } catch (e) {
        console.log("❌ Error loading user:", e);
      }
    })();
  }, []);

  // 🟢 Fetch Transactions
  useEffect(() => {
    if (!userId?._id) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          role: userId?.role || "",
          createdByEmail: userId?.email || "",
        }).toString();

        const res = await getData(
          `api/transaction/get-transaction-by-admin-with-pagination?${params}`
        );

        if (res?.status && Array.isArray(res.data)) {
          // 🟢 WEC = AMC-created transactions
          const wec = res.data.filter(
            (t) =>
              typeof t.description === "string" &&
              t.description.toLowerCase().includes("(id:-amc")
          );

          // 🟢 Wallet = all others
          const wallet = res.data.filter(
            (t) =>
              !(
                typeof t.description === "string" &&
                t.description.toLowerCase().includes("(id:-amc")
              )
          );

          setWecData(wec);
          setWalletData(wallet);
        } else {
          setWecData([]);
          setWalletData([]);
        }
      } catch (e) {
        console.log("❌ Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  // 🟢 Search Filter
  const getFilteredData = (data) =>
    data.filter((item) => {
      const text = searchText.toLowerCase();
      return (
        item.description?.toLowerCase().includes(text) ||
        item.name?.toLowerCase().includes(text) ||
        item.email?.toLowerCase().includes(text)
      );
    });

  const filteredData =
    activeTab === "wec" ? getFilteredData(wecData) : getFilteredData(walletData);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F7F8FA" barStyle="dark-content" />
      <View style={{ paddingTop: Platform.OS === "ios" ? insets.top : 0 }}>
        <Header />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {["wec", "wallet"].map((tab) => (
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

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Icon name="search" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab === "wec" ? "WEC" : "Wallet"} transactions...`}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Transaction List */}
      {loading ? (
        <ActivityIndicator size="large" color="#42A5F5" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item, index }) =>
            activeTab === "wec" ? (
              <WecTransactionItem item={item} index={index} />
            ) : (
              <WalletTransactionItem item={item} />
            )
          }
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#999", marginTop: 20 }}>
              No transactions found.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// 🧭 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FB" },
  tabsContainer: { flexDirection: "row", marginBottom: 12, marginHorizontal: 10 },
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
    marginHorizontal: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#000" },
  transactionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    marginHorizontal: 10,
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
  description: { fontSize: 13, fontWeight: "600", color: "#222" },
  date: { fontSize: 11, color: "#888", marginTop: 2 },
  amount: { fontSize: 15, fontWeight: "bold" },
  userTransactionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    marginHorizontal: 10,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  userIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
