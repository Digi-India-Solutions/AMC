import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const makeScale = (value) => (value * width) / 375;

export default function AmcDetailScreen({ route, navigation }) {
    const { emc } = route.params;

    const transactions = [
        { id: 1, type: "Top-Up", amount: 2000, date: "2025-10-01", status: "credit" },
        { id: 2, type: "Used", amount: 500, date: "2025-10-03", status: "debit" },
        { id: 3, type: "Top-Up", amount: 1500, date: "2025-10-05", status: "credit" },
    ];

    return (
        <ScrollView style={styles.container}>

            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.header}>{emc.name}</Text>
                <View style={[styles.statusBadge, emc.status === "Active" ? styles.active : styles.inactive]}>
                    <Text style={styles.statusText}>{emc.status}</Text>
                </View>
            </View>

            {/* EMC Info Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>EMC Details</Text>
                <Text style={styles.cardText}>Created On: {emc.created}</Text>
                <Text style={styles.cardText}>{emc.info}</Text>
            </View>

            {/* Wallet Info */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Wallet Info</Text>
                <Text style={styles.cardText}>Balance: ₹5000</Text>
                <Text style={styles.cardText}>Utilized: ₹1500</Text>
                <Text style={styles.cardText}>Top-Up Total: ₹6500</Text>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}>
                        <Text style={styles.buttonText}>Top-Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#FFA500" }]}>
                        <Text style={styles.buttonText}>Transfer</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Transactions */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Recent Transactions</Text>
                {transactions.map((tx) => (
                    <View key={tx.id} style={styles.transactionCard}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon
                                name={tx.status === "credit" ? "arrow-down-circle" : "arrow-up-circle"}
                                size={24}
                                color={tx.status === "credit" ? "#4CAF50" : "#F44336"}
                                style={{ marginRight: 12 }}
                            />
                            <View>
                                <Text style={styles.transactionType}>{tx.type}</Text>
                                <Text style={styles.transactionDate}>{tx.date}</Text>
                            </View>
                        </View>
                        <Text
                            style={[
                                styles.transactionAmount,
                                { color: tx.status === "credit" ? "#4CAF50" : "#F44336" },
                            ]}
                        >
                            {tx.status === "credit" ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F8F8", padding: makeScale(15) },
    headerContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: makeScale(15) },
    backButton: { marginRight: makeScale(10) },
    header: { fontSize: makeScale(20), fontWeight: "bold", flex: 1, textAlign: "center" },
    statusBadge: { paddingVertical: makeScale(4), paddingHorizontal: makeScale(10), borderRadius: makeScale(12) },
    active: { backgroundColor: "#4CAF50" },
    inactive: { backgroundColor: "#FF5252" },
    statusText: { color: "#fff", fontWeight: "bold" },
    card: { backgroundColor: "#fff", borderRadius: makeScale(10), padding: makeScale(15), marginBottom: makeScale(15), shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3 },
    cardTitle: { fontSize: makeScale(18), fontWeight: "600", marginBottom: makeScale(8) },
    cardText: { fontSize: makeScale(14), marginBottom: makeScale(4) },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: makeScale(10) },
    actionButton: { flex: 0.48, paddingVertical: makeScale(10), borderRadius: makeScale(8), alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" },
    transactionCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: makeScale(8), padding: makeScale(10), borderRadius: makeScale(10), backgroundColor: "#f9f9f9" },
    transactionType: { fontSize: makeScale(14), fontWeight: "500" },
    transactionDate: { fontSize: makeScale(12), color: "#888" },
    transactionAmount: { fontSize: makeScale(14), fontWeight: "bold" },
});