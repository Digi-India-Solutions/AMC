import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../components/uicomponents/Header";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const insets = useSafeAreaInsets();

  const fetchDashboardData = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000)); // Simulated API delay

    const data = {
      stats: { totalAMCs: 23, activeContracts: 19, today: 5, totalRevenue: 0.5 },
      growth: { amcs: "+12%", contracts: "+8%", today: "+3%", revenue: "+15%" },
      lineData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{ data: [45, 52, 48, 61, 55, 67] }],
      },
      barData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{ data: [180000, 210000, 195000, 250000, 220000, 270000] }],
      },
      pieData: [
        { name: "AC", population: 35, color: "#4F86F7" },
        { name: "Refrigerator", population: 25, color: "#1ABC9C" },
        { name: "Mobile", population: 20, color: "#F5A623" },
        { name: "Laptop", population: 12, color: "#FF6B6B" },
        { name: "Others", population: 8, color: "#A66DD4" },
      ],
      recentActivity: [
        { icon: "add-circle", text: "New AMC created for Samsung AC", time: "2 hours ago" },
        { icon: "checkmark-done", text: "AMC renewal completed", time: "4 hours ago" },
        { icon: "wallet", text: "Commission credited to wallet", time: "6 hours ago" },
        { icon: "person-add", text: "New retailer registered", time: "1 day ago" },
      ],
    };
    setDashboardData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !dashboardData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F86F7" />
        <Text style={{ marginTop: 10 }}>Loading Dashboard...</Text>
      </View>
    );
  }

  const { stats, growth, lineData, barData, pieData, recentActivity } = dashboardData;

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

      {/* ✅ Main ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10 }}
      >
        {/* Title Row */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity style={styles.exportBtn}>
            <Icon name="download-outline" size={18} color="#fff" />
            <Text style={styles.exportText}>Export Report</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            title="Total AMCs"
            value={stats.totalAMCs}
            growth={growth.amcs}
            icon="documents-outline"
            color="#4F86F7"
          />
          <StatCard
            title="Active Contracts"
            value={stats.activeContracts}
            growth={growth.contracts}
            icon="checkmark-circle-outline"
            color="#1ABC9C"
          />
          <StatCard
            title="Today"
            value={stats.today}
            growth={growth.today}
            icon="calendar-outline"
            color="#F5A623"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue}L`}
            growth={growth.revenue}
            icon="cash-outline"
            color="#A66DD4"
          />
        </View>

        {/* Charts */}
        <ChartCard title="AMC Sales Trend">
          <LineChart
            data={lineData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
          />
        </ChartCard>

        <ChartCard title="Monthly Revenue">
          <BarChart
            data={barData}
            width={width - 40}
            height={220}
            yAxisLabel="₹"
            chartConfig={chartConfig}
            style={styles.chartStyle}
          />
        </ChartCard>

        <ChartCard title="AMC Distribution by Product Category">
          <PieChart
            data={pieData.map((item) => ({
              ...item,
              legendFontColor: "#000",
              legendFontSize: 13,
            }))}
            width={width - 40}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </ChartCard>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.chartTitle}>Recent Activity</Text>
          {recentActivity.map((item, i) => (
            <View key={i} style={styles.activityItem}>
              <Icon name={item.icon} size={22} color="#4F86F7" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.activityText}>{item.text}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ========== Reusable Components ========== */
const StatCard = ({ title, value, growth, icon, color }) => (
  <View style={styles.card}>
    <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
      <Icon name={icon} size={22} color={color} />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardGrowth}>↑ {growth} from last month</Text>
  </View>
);

const ChartCard = ({ title, children }) => (
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>{title}</Text>
    {children}
  </View>
);

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(79, 134, 247, ${opacity})`,
  labelColor: () => "#555",
  decimalPlaces: 0,
  propsForDots: { r: "4", strokeWidth: "1", stroke: "#4F86F7" },
};

/* ========== Styles ========== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "700" },
  exportBtn: {
    flexDirection: "row",
    backgroundColor: "#4F86F7",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  exportText: { color: "#fff", marginLeft: 5, fontWeight: "600" },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: { color: "#555", marginTop: 8 },
  cardValue: { fontSize: 20, fontWeight: "700", marginTop: 4 },
  cardGrowth: { color: "#16a34a", fontSize: 12, marginTop: 4 },

  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  chartTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  chartStyle: { borderRadius: 8 },

  activitySection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  activityText: { fontSize: 14, fontWeight: "500" },
  activityTime: { fontSize: 12, color: "#777" },
});
