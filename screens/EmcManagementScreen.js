import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Drawer from "../components/uicomponents/Drawer";
import Header from "../components/uicomponents/Header";

const { width, height } = Dimensions.get("window");

// Mock fetch
const fetchAMCs = async () => {
  await new Promise((r) => setTimeout(r, 500));
  const data = [
    {
      id: "WEC001",
      customer: "Rohit Rajput",
      category: "AC",
      brand: "Voltas",
      model: "123V DZU",
      amount: 2500,
      startDate: "2024-01-15",
      endDate: "2025-12-30" // Active
    },
    {
      id: "WEC002",
      customer: "Priya Sharma",
      category: "Refrigerator",
      brand: "LG",
      model: "GL-T292RPZY",
      amount: 2880,
      startDate: "2023-10-01",
      endDate: "2025-09-30" // Active
    },
    {
      id: "WEC003",
      customer: "Amit Verma",
      category: "Laptop",
      brand: "Dell",
      model: "Inspiron 15",
      amount: 4200,
      startDate: "2022-01-01",
      endDate: "2023-12-31" // Expired
    },
    {
      id: "WEC004",
      customer: "Sneha Gupta",
      category: "Washing Machine",
      brand: "Samsung",
      model: "WA70A4002GS",
      amount: 3100,
      startDate: "2023-06-15",
      endDate: "2025-11-01" // Active
    },
    {
      id: "WEC005",
      customer: "Vikram Mehta",
      category: "Water Purifier",
      brand: "Kent",
      model: "Grand Plus",
      amount: 1800,
      startDate: "2022-04-01",
      endDate: "2024-05-01"
    }
  ];

  const today = new Date();
  return data.map((item) => {
    const end = new Date(item.endDate);
    const daysLeft = Math.floor((end - today) / (1000 * 60 * 60 * 24));
    let status = "Active";
    if (daysLeft < 0) status = "Expired";
    return { ...item, status, daysLeft };
  });
}


const statusColor = (status) => {
  if (status === "Active") return "#16a34a";
  if (status === "Expired") return "#ef4444";
  return "#999";
};
const categoryColor = (category) => {
  switch (category) {
    case "AC": return "#E0F7FA";
    case "Refrigerator": return "#FFF3E0";
    case "Laptop": return "#EDE7F6";
    default: return "#F5F5F5";
  }
};


const AMCCard = ({ item, index }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: index * 100,
      useNativeDriver: true,
      friction: 7,
    }).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
  const opacity = anim;

  return (
    <Animated.View
      style={[
        styles.cardRow,
        { opacity, transform: [{ translateY }], backgroundColor: categoryColor(item.category) },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.id}</Text>
        <Text style={styles.cardSub}>{item.customer}</Text>
        <Text style={styles.cardSubSmall}>
          {item.category} | {item.brand} | {item.model}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.cardSubSmall}>Start: {item.startDate}</Text>
          <Text style={styles.cardSubSmall}>End: {item.endDate}</Text>
        </View>

        <Text style={[styles.cardSubSmall, { marginTop: 2 }]}>
          Amount: ₹{item.amount}
        </Text>
      </View>

      {/* Right icons */}
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={[
            styles.status,
            { borderColor: statusColor(item.status), color: statusColor(item.status) },
          ]}
        >
          {item.status}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Pressable
            onPress={() => Alert.alert("Share", `Sharing ${item.id}`)}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, marginRight: 12 }]}
          >
            <Icon name="share-social-outline" size={22} color="#2563eb" />
          </Pressable>
          {/* <Pressable
            onPress={() => Alert.alert("Edit", `Editing ${item.id}`)}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, marginRight: 12 }]}
          >
            <Icon name="pencil-outline" size={22} color="#2563eb" />
          </Pressable> */}
          {/* <Pressable
            onPress={() => Alert.alert("Options", `More options for ${item.id}`)}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          >
            <Icon name="ellipsis-vertical" size={22} color="#555" />
          </Pressable> */}
        </View>
      </View>
    </Animated.View>
  );
};

// Summary Card
const SummaryCard = ({ label, count, color, icon, index }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, delay: index * 100, useNativeDriver: true }).start();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
  const opacity = anim;

  return (
    <Animated.View style={[styles.summaryCard, { opacity, transform: [{ translateY }] }]}>
      <View style={[styles.cardIcon, { backgroundColor: `${color}22` }]}>
        <Icon name={icon} color={color} size={24} />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={[styles.cardValue, { color }]}>{count}</Text>
    </Animated.View>
  );
};

export default function EmcManagementScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [amcs, setAmcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showDrawer, setShowDrawer] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  useEffect(() => {
    const load = async () => {
      const data = await fetchAMCs();
      setAmcs(data);
      setLoading(false);
    };
    load();
  }, []);

  const openDrawer = () => {
    setShowDrawer(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };
  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.75,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setShowDrawer(false));
  };

  const categories = useMemo(() => ["All", ...new Set(amcs.map((a) => a.category))], [amcs]);
  const filtered = useMemo(
    () =>
      amcs.filter((item) => {
        const matchQuery =
          item.customer.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase());
        const matchStatus = statusFilter === "All" || item.status === statusFilter;
        const matchCategory = categoryFilter === "All" || item.category === categoryFilter;
        return matchQuery && matchStatus && matchCategory;
      }),
    [amcs, query, statusFilter, categoryFilter]
  );

  const counts = useMemo(
    () => ({
      total: amcs.length,
      active: amcs.filter((a) => a.status === "Active").length,
      expired: amcs.filter((a) => a.status === "Expired").length,
    }),
    [amcs]
  );

  if (loading)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Loading WEC Data...</Text>
      </SafeAreaView>
    );

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


      {/*  <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6fa" }}>
       <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />
       <Header />
       <View style={styles.divider} />*/}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
        style={{ flex: 1 }}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>WEC Management</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("CreateAmcScreen")}>
            <Icon name="add" color="#fff" size={18} />
            <Text style={styles.addTxt}>Create WEC</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <SummaryCard label="Total WECs" count={counts.total} color="#3b82f6" icon="documents-outline" index={0} />
          <SummaryCard label="Active" count={counts.active} color="#10b981" icon="checkmark-circle-outline" index={1} />
          <SummaryCard label="Expired" count={counts.expired} color="#ef4444" icon="close-circle-outline" index={2} />
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <View style={styles.searchBox}>
            <Icon name="search-outline" size={18} color="#777" />
            <TextInput
              placeholder="Search by name or WEC ID"
              style={styles.input}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
            {["All", "Active", "Expired"].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.filterChip, { backgroundColor: statusFilter === s ? "#2563eb" : "#fff" }]}
                onPress={() => setStatusFilter(s)}
              >
                <Text style={{ color: statusFilter === s ? "#fff" : "#333", fontWeight: "500" }}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.filterChip, { backgroundColor: categoryFilter === c ? "#2563eb" : "#fff" }]}
                onPress={() => setCategoryFilter(c)}
              >
                <Text style={{ color: categoryFilter === c ? "#fff" : "#333", fontWeight: "500" }}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AMC Cards */}
        {filtered.length > 0 ? (
          filtered.map((item, i) => <AMCCard key={i} item={item} index={i} />)
        ) : (
          <Text style={styles.empty}>No WEC found</Text>
        )}
      </ScrollView>

      {/* Drawer */}
      {showDrawer && (
        <>
          <TouchableOpacity
            style={styles.drawerOverlay}
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
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  safeContainer: {
    flex: 1,
    backgroundColor: "#f5f6fa",

  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  addBtn: { backgroundColor: "#2563eb", flexDirection: "row", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: "center" },
  addTxt: { color: "#fff", marginLeft: 6, fontWeight: "600" },
  summaryContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  summaryCard: { backgroundColor: "#fff", borderRadius: 12, padding: 14, width: "31%", marginVertical: 6, elevation: 3 },
  cardIcon: { width: 42, height: 42, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  cardLabel: { color: "#6B7280", marginTop: 6 },
  cardValue: { fontSize: 20, fontWeight: "700", marginTop: 4 },
  filterSection: { marginTop: 12 },
  searchBox: { flex: 1, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", elevation: 2 },
  input: { flex: 1, marginLeft: 6, height: 40 },
  filterChip: { borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginHorizontal: 4 },
  cardRow: { flexDirection: "row", padding: 16, borderRadius: 12, marginVertical: 6, elevation: 3, justifyContent: "space-between" },
  cardTitle: { fontWeight: "700", fontSize: 16, marginBottom: 2 },
  cardSub: { fontSize: 14, color: "#333", marginBottom: 2 },
  cardSubSmall: { fontSize: 12, color: "#555" },
  status: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, fontSize: 12, fontWeight: "600" },
  empty: { textAlign: "center", marginVertical: 20, color: "#555", fontSize: 14 },
  divider: { height: 1, backgroundColor: "#E0E0E0" },
  drawerOverlay: { position: "absolute", top: 0, left: 0, width, height, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 998 },
  drawer: { position: "absolute", top: 0, left: 0, width: width * 0.75, height, backgroundColor: "#fff", zIndex: 999, elevation: 10 },
});
