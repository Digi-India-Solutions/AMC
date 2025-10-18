import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Drawer() {
    const navigation = useNavigation();
    const [loggedIn, setLoggedIn] = useState(false); 

    return (
        <View style={styles.drawerContainer}>
            
            
            <View style={styles.logoContainer}>
                <Image
                    source={require("../../assets/1.png")} 
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Middle: Login / Sign Up */}
            <View style={styles.menuWrapper}>
                {!loggedIn && (
                    <>
                        <TouchableOpacity
                            style={styles.authButton}
                            onPress={() => navigation.navigate('LoginScreen')}
                        >
                            <Text style={styles.authText}>Login</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            style={[styles.authButton, { backgroundColor: "#4F86F7", marginTop: 10 }]}
                            onPress={() => navigation.navigate('SignupScreen')}
                        >
                            <Text style={[styles.authText, { color: "#fff" }]}>Sign Up</Text>
                        </TouchableOpacity> */}
                    </>
                )}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        width: width * 0.75,
        height: height, // Full screen height
        backgroundColor: "#fff",
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 50,
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
    },
    menuWrapper: {
        flex: 1,
        justifyContent: "flex-start",
    },
    authButton: {
        backgroundColor: "#fff",
        paddingVertical: 14,
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
});
