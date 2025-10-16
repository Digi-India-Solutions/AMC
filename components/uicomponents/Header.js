import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, Image, StyleSheet, } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";
import Drawer from '../uicomponents/Drawer'
import { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get("window");

const Header = () => {
    const navigation = useNavigation()
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


    return (
        <View style={styles.topHeader}>
            <View style={styles.logoContainer}>
                <TouchableOpacity onPress={openDrawer}>
                    <Icon name="menu" size={28} color="#333" />
                </TouchableOpacity>
                <Image source={require("../../assets/emicare.png")} style={{ height: 50, width: 150 }} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                <Image source={require("../../assets/logo.png")} style={styles.profileImage} />
            </TouchableOpacity>
            {/* Drawer */}
            {showDrawer && (
                <>
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width,
                            height,
                            backgroundColor: "rgba(0,0,0,0.3)",
                            zIndex: 998,
                        }}
                        activeOpacity={1}
                        onPress={closeDrawer}
                    />
                    <Animated.View
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: width * 0.75,
                            height,
                            backgroundColor: "#fff",
                            transform: [{ translateX: slideAnim }],
                            zIndex: 999,
                            elevation: 10,
                            paddingTop: 0,
                        }}
                    >
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <Drawer />
                        </ScrollView>
                    </Animated.View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 },
    logoContainer: { flexDirection: "row", alignItems: "center" },
    profileImage: { width: 50, height: 50, borderRadius: 20 },
})

export default Header