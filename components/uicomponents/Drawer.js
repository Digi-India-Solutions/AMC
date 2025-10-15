
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

export default function CustomDrawerModal({ onClose }) {
    const navigation = useNavigation();


    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <View style={styles.drawerContainer}>
            {loggedIn ? (
                <>

                    <View style={styles.profileSection}>
                        <Image source={require("../../assets/2.png")} style={styles.profileImage} />
                        <Text style={styles.profileName}>Rohit Rajput</Text>
                        <Text style={styles.profileEmail}>rohit@example.com</Text>
                    </View>


                    <View style={styles.menuSection}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => navigation.navigate('ProfileScreen')}
                        >
                            <Icon name="person-outline" size={22} color="#333" />
                            <Text style={styles.menuText}>My Profile</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => navigation.navigate('AMCDashboardScreen')}
                        >
                            <Icon name="grid-outline" size={22} color="#333" />
                            <Text style={styles.menuText}>Dashboard</Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity
                        style={styles.logoutItem}
                        onPress={() => setLoggedIn(false)}
                    >
                        <Icon name="log-out-outline" size={22} color="#E63946" />
                        <Text style={[styles.menuText, { color: "#E63946" }]}>Logout</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>

                    <View style={styles.profileSection}>
                        <Text style={styles.profileName}>Welcome!</Text>
                        <Text style={styles.profileEmail}>Please login or signup</Text>
                    </View>


                    <View style={styles.menuSection}>
                        <TouchableOpacity
                            style={styles.authButton}
                            onPress={() => navigation.navigate('LoginScreen')}
                        >
                            <Text style={styles.authText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.authButton, { backgroundColor: "#4F86F7", marginTop: 10 }]}
                            onPress={() => navigation.navigate('SignupScreen')}
                        >
                            <Text style={[styles.authText, { color: "#fff" }]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {/* Optional Close Button */}
            {/* <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Icon name="close" size={28} color="#333" />
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        width: width * 0.75,
        height: "100%",
        backgroundColor: "#fff",
        paddingVertical: 30,
        paddingHorizontal: 20,
        position: "absolute",
        left: 0,
        top: 0,
    },
    profileSection: {
        alignItems: "center",
        marginBottom: 30,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "#4F86F7",
        marginBottom: 10,
    },
    profileName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#4F86F7",
        marginBottom: 5,
    },
    profileEmail: {
        color: "#666",
        fontSize: 13,
        textAlign: "center",
    },
    menuSection: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#eee",
        paddingVertical: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    menuText: {
        fontSize: 16,
        marginLeft: 10,
        color: "#333",
    },
    logoutItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        marginTop: 20,
    },
    authButton: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#4F86F7",
    },
    authText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4F86F7",
    },
    closeBtn: {
        position: "absolute",
        top: 20,
        right: 15,
    },
});
