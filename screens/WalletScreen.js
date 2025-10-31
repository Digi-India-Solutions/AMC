// 🟢 AllTransactions.js — Final Stable Version (with decimal & count fix)
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
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

export default function AllTransactions() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [search, setSearch] = useState("");

  // 🟢 Step 1: Load User Data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const user = parsed?.user ? parsed.user : parsed;
          console.log("✅ User Loaded:", user);
          setUserId(user);
        } else {
          console.log("⚠️ No user found in AsyncStorage");
        }
      } catch (e) {
        console.log("❌ Error loading AsyncStorage:", e);
      }
    };
    loadUserData();
  }, []);

  // 🟢 Step 2: Fetch Wallet + Transactions
  useEffect(() => {
    if (!userId?._id) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        await fetchWalletManagement();
        await fetchTransactions();
      } catch (e) {
        console.log("❌ Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  // 🟢 Fetch Wallet Summary
  const fetchWalletManagement = async () => {
    try {
      const res = await getData(
        `api/transaction/getWalletManagementByAdmin/${userId._id}`
      );
      console.log("🟢 Wallet API Response:", res);

      const wallet = res?.data || res || {};
      if (res?.status || wallet?.totalBalance !== undefined) {
        setTotalBalance(parseFloat(wallet.totalBalance || 0).toFixed(2));
        setTotalCredit(parseFloat(wallet.totalCredit || 0).toFixed(2));
        setTotalDebit(parseFloat(wallet.totalDebit || 0).toFixed(2));
      } else {
        console.log("⚠️ Wallet response structure unexpected:", res);
      }
    } catch (e) {
      console.log("❌ Wallet API Error:", e);
    }
  };

  // 🟢 Fetch Transactions
  const fetchTransactions = async () => {
    try {
      const params = {
        role: userId?.role || "",
        createdByEmail: userId?.email || "",
      };
      const query = new URLSearchParams(params).toString();

      const res = await getData(
        `api/transaction/get-transaction-by-admin-with-pagination?${query}`
      );

      if (res?.status && Array.isArray(res.data)) {
        setTransactions(res.data);
      } else {
        setTransactions([]);
      }
    } catch (e) {
      console.log("❌ Transaction API Error:", e);
    }
  };

  // 🟢 Animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🟢 Date Formatter
  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 🟢 Filter Transactions by Search
  const filtered = transactions.filter((t) =>
    t?.description?.toLowerCase()?.includes(search?.toLowerCase())
  );

  // 🟢 Summary Card
  const SummaryCard = ({ title, value, color, icon, showRupee = true }) => (
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
          <Text style={[styles.cardValue, { color }]}>
            {showRupee ? `₹${value}` : value}
          </Text>
        </View>
        <View style={[styles.iconBox, { backgroundColor: color }]}>
          <Icon name={icon} size={makeScale(15)} color="#fff" />
        </View>
      </View>
    </Animated.View>
  );

  // 🟢 Render Transaction Row
  const renderTransaction = ({ item, index }) => {
    const anim = new Animated.Value(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 70,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View
        style={[
          styles.transactionCard,
          {
            opacity: anim,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [15, 0],
                }),
              },
            ],
          },
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
            <Icon
              name={item.type === "credit" ? "arrow-up" : "arrow-down"}
              size={22}
              color="#fff"
            />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.description}>
              {item?.description || "No description"}
            </Text>
            <Text style={styles.date}>
              {formatDate(item?.createdDate || item?.createdAt)}
            </Text>
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
      <StatusBar backgroundColor="#F7F8FA" barStyle="dark-content" />
      <View style={{ paddingTop: Platform.OS === "ios" ? insets.top : 0 }}>
        <Header />
      </View>

      {/* 🟢 Main List with Header */}
      <FlatList
        ListHeaderComponent={
          <View style={{ padding: makeScale(10) }}>
            {/* 🟢 Wallet Summary */}
            <View style={styles.cardContainer}>
              <SummaryCard
                title="Total Balance"
                value={totalBalance}
                color="#00C853"
                icon="wallet"
              />
              <SummaryCard
                title="Total Credit"
                value={totalCredit}
                color="#2979FF"
                icon="arrow-up-circle"
              />
            </View>
            <View style={styles.cardContainer}>
              <SummaryCard
                title="Total Debit"
                value={totalDebit}
                color="#D50000"
                icon="arrow-down-circle"
              />
              <SummaryCard
                title="Transactions"
                value={transactions.length}
                color="#FFA000"
                icon="receipt"
                showRupee={false} // 🟢 No ₹ sign for count
              />
            </View>

            {/* 🟢 Search */}
            <View style={styles.searchContainer}>
              <Icon
                name="search"
                size={18}
                color="#777"
                style={{ marginRight: 6 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search transactions..."
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="#999"
              />
            </View>

            {/* 🟢 Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>All Transactions</Text>
            </View>
          </View>
        }
        data={filtered}
        keyExtractor={(i) => i._id?.toString()}
        renderItem={renderTransaction}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#2979FF"
              style={{ marginVertical: 20 }}
            />
          ) : (
            <Text style={styles.noData}>No transactions found.</Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

// 🟢 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  titleContainer: { alignItems: "center", marginBottom: 10, marginTop: 5 },
  titleText: {
    fontSize: makeScale(16),
    fontWeight: "700",
    color: "#1A1A1A",
    textTransform: "uppercase",
    fontStyle: "italic",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 13, color: "#666" },
  cardValue: { fontSize: 15, fontWeight: "700" },
  iconBox: { padding: 10, borderRadius: 10 },
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
  transactionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
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
  description: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    fontStyle: "italic",
  },
  date: { fontSize: 12, color: "#888", marginTop: 2 },
  amount: { fontSize: 15, fontWeight: "bold" },
  noData: { textAlign: "center", marginTop: 20, color: "#999" },
});
