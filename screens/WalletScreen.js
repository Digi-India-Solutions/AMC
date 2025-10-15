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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Drawer from "../components/uicomponents/Drawer";

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
  ],
  transactions: [
    { id: 1, name: "Top-Up", type: "Credit", email: "2025-10-01", balance: 1000, status: "Success" },
    { id: 2, name: "Purchase", type: "Debit", email: "2025-10-02", balance: 500, status: "Failed" },
  ],
};

export default function WalletManagement({ navigation }) {
  const [wallet] = useState(dummyWallet);
  const [selectedTab, setSelectedTab] = useState("Wallet Balances");
  const [search, setSearch] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [rowAnim, setRowAnim] = useState([]);

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

  useEffect(() => {
    const dataToShow = selectedTab === "Wallet Balances" ? wallet.users : wallet.transactions;
    const anims = dataToShow.map(() => new Animated.Value(0));
    setRowAnim(anims);

    anims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [selectedTab, search]);

  const renderCard = (title, value, color, icon) => (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor: color + "33",
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
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

  const dataToShow = selectedTab === "Wallet Balances" ? wallet.users : wallet.transactions;
  const filteredData = dataToShow.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} >
        {/* Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={openDrawer}>
            <Icon name="menu" size={28} color="#333" />
          </TouchableOpacity>
          <Image source={require("../assets/emicare.png")} style={{ height: 50, width: 150 }} />
          <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
            <Image source={require("../assets/logo.png")} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        <Text style={styles.header}>Wallet Management</Text>

        {/* Summary Cards */}
        <View style={styles.cardContainer}>
          {renderCard("Total Balance", wallet.totalBalance, "#00C853", "wallet")}
          {renderCard("Total Credits", wallet.totalCredits, "#2979FF", "arrow-up-circle")}
        </View>
        <View style={styles.cardContainer}>
          {renderCard("Total Debits", wallet.totalDebits, "#D50000", "arrow-down-circle")}
          {renderCard("Transactions", wallet.transactions.length, "#FFA000", "receipt")}
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
                {tab} ({tab === "Wallet Balances" ? wallet.users.length : wallet.transactions.length})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} color="#777" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users or transactions..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
        </View>

        {/* Box Cards instead of table */}
        <View style={{ paddingBottom: 20 }}>
          {filteredData.length > 0 ? filteredData.map((item, index) => {
            if (!rowAnim[index]) return null;

            const backgroundColor =
              item.status === "Active" || item.status === "Success"
                ? "#E8F5E9"
                : item.status === "Inactive" || item.status === "Failed"
                  ? "#FFEBEE"
                  : "#fff";

            return (
              <View key={item.id} style={{ marginBottom: 10 }}>
                <Animated.View
                  style={[
                    styles.boxCard,
                    {
                      opacity: rowAnim[index],
                      transform: [{ translateY: rowAnim[index].interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }],
                      backgroundColor,
                    },
                  ]}
                >
                  <View style={styles.boxRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.boxName}>{item.name}</Text>
                      <Text style={styles.boxType}>{item.type}</Text>
                      <Text style={styles.boxEmail}>{item.email}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.boxBalance}>₹{item.balance}</Text>
                      <Text style={[styles.boxStatus, { color: item.status === "Active" || item.status === "Success" ? "#00C853" : "#D32F2F" }]}>
                        {item.status}
                      </Text>
                      <TouchableOpacity style={styles.moreBtn}>
                        <Icon name="ellipsis-vertical" size={18} color="#555" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              </View>
            );
          }) : (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#999" }}>No records found.</Text>
          )}
        </View>
      </ScrollView>

      {/* Full-screen Drawer */}
      {showDrawer && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={closeDrawer}
          />
          <Animated.View
            style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  profileImage: { width: 50, height: 50, borderRadius: 20 },
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

  // Box/Card styles
  boxCard: { borderRadius: 12, padding: 15, elevation: 2 },
  boxRow: { flexDirection: "row", justifyContent: "space-between" },
  boxName: { fontSize: 16, fontWeight: "700" },
  boxType: { fontSize: 13, color: "#555", marginTop: 2 },
  boxEmail: { fontSize: 12, color: "#777", marginTop: 2 },
  boxBalance: { fontSize: 16, fontWeight: "700", textAlign: "right" },
  boxStatus: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  moreBtn: { marginTop: 8 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 998 },
  drawer: { position: "absolute", top: 0, left: 0, width: width * 0.75, height, backgroundColor: "#fff", zIndex: 999, elevation: 10 },
});
