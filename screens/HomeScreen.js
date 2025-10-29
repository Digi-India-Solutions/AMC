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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/uicomponents/Header";
import { getData } from "../services/FetchNodeAdminServices";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);

  const insets = useSafeAreaInsets();

  const [amcs, setAmcs] = useState(0);
  const [totaleActiveAcount, setTotaleActiveAcount] = useState(0);
  const [totalExpiringThisMonth, setTotalExpiringThisMonth] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDistributors, setTotalDistributors] = useState(0);
  const [totalRetailers, setTotalRetailers] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const formatAmount = (amount) => {
    if (amount >= 100000) return `${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(2)}k`;
    return amount.toString();
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log("🟡 Loading user data from AsyncStorage...");
        const storedUser = await AsyncStorage.getItem("userData");

        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const userData = parsed?.user ? parsed.user : parsed;
          setUser(userData);
          console.log("✅ Loaded User Data:", userData);
        } else {
          console.log("⚠️ No user data found in AsyncStorage");
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error loading user:", error);
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("🟢 Fetching dashboard data for user:", user.email || user.name);
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const queryJson = new URLSearchParams({
        userId: user?.id?.toString() || "",
        role: user?.role?.toString() || "",
        createdByEmail: JSON.stringify({
          email: user?.email?.toString() || "",
          name: user?.name?.toString() || "",
        }),
      });

      console.log("Dashboard API URL =>", `api/dashboard/get-all-amc-total?${queryJson}`);


      const response = await getData(`api/dashboard/get-all-amc-total?${queryJson}`);


      console.log("📊 Dashboard API Response:", JSON.stringify(response, null, 2));

      const data = response?.data || response?.result || response;

      if (!data) {
        console.log("⚠️ No usable data found in API response");
        setLoading(false);
        return;
      }
      console.log("====>>>>>>>", data);
      setDashboardData(data);

      setAmcs(data.totalAmc || 0);
      setTotaleActiveAcount(data.totalActiveAccount || 0);
      setTotalExpiringThisMonth(data.totalExpiringThisMonth || 0);
      setTotalRevenue(data.totalRevenue || 0);
      setTotalDistributors(data.totalDistributors || 0);
      setTotalRetailers(data.totalRetailers || 0);
      // setSalesData(data.amcSalesData || 0)

      // ✅ Sales Data for WEC Sales Trend
      const formattedSalesData = data.amcSalesData
        ? {
          labels: data.amcSalesData.map((item) => item.month || "N/A"),
          datasets: [
            {
              data: data.amcSalesData.map((item) => item.sales || 0),
            },
          ],
        }
        : { labels: [], datasets: [{ data: [] }] };

      // ✅ Revenue Data for Monthly Revenue
      const formattedRevenueData = data.amcRevenueData
        ? {
          labels: data.amcRevenueData.map((item) => item.month || item.label || "N/A"),
          datasets: [
            {
              data: data.amcRevenueData.map((item) => item.revenue || item.value || 0),
            },
          ],
        }
        : formattedSalesData;

      const formattedProductData = data.amcProductData
        ? data.amcProductData.map((item, index) => ({
          name: item.product || item.name || `Item ${index + 1}`,
          population: item.count || item.value || 0,
          color: ["#4F86F7", "#1ABC9C", "#F5A623", "#FF6B6B", "#A66DD4"][index % 5],
          legendFontColor: "#000",
          legendFontSize: 12,
        }))
        : [];

      setSalesData(formattedSalesData);
      setRevenueData(formattedRevenueData);
      setProductData(formattedProductData);
      setRecentActivities(data.amcRecentActivities || []);

      // console.log("✅ Charts Ready:", { formattedSalesData, formattedRevenueData, formattedProductData });
    } catch (error) {
      console.error("❌ Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log('Sales Data', salesData);


  if (loading || !dashboardData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F86F7" />
        <Text style={{ marginTop: 10 }}>Loading Dashboard...</Text>
      </View>
    );
  }

  const growth = dashboardData?.growth || {};
  console.log("SSSSSSSSSSSSSSS:==>", salesData)
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F7F8FA" barStyle="dark-content" />

      <View style={{ paddingTop: Platform.OS === "ios" ? insets.top : 0 }}>
        <Header />
      </View>

      <View style={styles.divider} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity style={styles.exportBtn}>
            <Icon name="download-outline" size={18} color="#fff" />
            <Text style={styles.exportText}>Export Report</Text>
          </TouchableOpacity>
        </View>

        {/* ==== Stats Section ==== */}
        <View style={styles.statsRow}>
          <StatCard title="Total WECs" value={amcs.toLocaleString()} icon="documents-outline" color="#4F86F7" />
          <StatCard title="Active Contracts" value={totaleActiveAcount.toLocaleString()} icon="checkmark-circle-outline" color="#1ABC9C" />
          <StatCard title="Expiring This Month" value={totalExpiringThisMonth.toLocaleString()} icon="calendar-outline" color="#F5A623" />
          <StatCard title="Total Revenue" value={`₹${formatAmount(totalRevenue)}`} icon="cash-outline" color="#A66DD4" />
        </View>

        {/* ==== WEC Sales Trend ==== */}
        <ChartCard title="WEC Sales Trend">
          <LineChart
            data={salesData}
            width={width - 40}
            height={220}
            yAxisLabel="₹"
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(59,130,246,${opacity})`,
              labelColor: () => "#000",
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#3B82F6",
              },
            }}
            bezier
            style={{ borderRadius: 10 }}
            fromZero={true}
          />
        </ChartCard>

        <ChartCard title="Monthly Revenue">
          <BarChart
            data={salesData}
            width={width - 40}
            height={220}
            yAxisLabel="₹"
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(16,185,129,${opacity})`,
              labelColor: () => "#000",
              barPercentage: 0.6,
            }}
            fromZero={true}
            showValuesOnTopOfBars={true}
            withInnerLines={false}
            style={{ borderRadius: 10 }}
          />
        </ChartCard>

        <ChartCard title="WEC Distribution by Product Category">
          <PieChart
            data={productData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </ChartCard>

        {/* ==== Recent Activities ==== */}
        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <TouchableOpacity key={index} style={styles.activityItem} activeOpacity={0.7}>
                <View style={styles.iconCircle}>
                  <Icon name={activity.icon || "time-outline"} size={22} color={activity.color || "#4F86F7"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityMeta}>{activity.user} • {activity.time}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noActivity}>No recent activities found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* --- Reusable Components --- */
const StatCard = ({ title, value, icon, color }) => (
  <View style={styles.card}>
    <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
      <Icon name={icon} size={22} color={color} />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "700" },
  exportBtn: { flexDirection: "row", backgroundColor: "#4F86F7", padding: 8, borderRadius: 8, alignItems: "center" },
  exportText: { color: "#fff", marginLeft: 5, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#E0E0E0" },
  statsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", backgroundColor: "#fff", borderRadius: 10, padding: 15, marginVertical: 6, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  cardTitle: { color: "#555", marginTop: 8 },
  cardValue: { fontSize: 20, fontWeight: "700", marginTop: 4 },
  chartContainer: { backgroundColor: "#fff", borderRadius: 10, padding: 10, marginVertical: 8 },
  chartTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  chartStyle: { borderRadius: 8 },
  activityContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginVertical: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 100 },
  activityTitle: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 12 },
  activityItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 8 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", marginRight: 12 },
  activityAction: { fontSize: 14, fontWeight: "500", color: "#111827" },
  activityMeta: { fontSize: 12, color: "#6B7280" },
  noActivity: { fontSize: 14, color: "#6B7280", textAlign: "center", paddingVertical: 10 },
});
