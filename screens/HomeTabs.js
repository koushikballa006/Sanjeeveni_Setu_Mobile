import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ActivityScreen from "../screens/AcitivityScreen"; // Make sure this is defined
import DiagnosticsScreen from "../screens/DiagnosticsScreen"; // Make sure this is defined
import Icon from "react-native-vector-icons/FontAwesome5";
import { StyleSheet, Platform, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Calculate responsive sizes
const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size; // Assuming design is based on 375px width

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Activity") {
            iconName = "walking";
          } else if (route.name === "Diagnostics") {
            iconName = "file-medical-alt";
          } else if (route.name === "Settings") {
            iconName = "cog";
          }

          return (
            <Icon name={iconName} size={responsiveFontSize(24)} color={color} />
          );
        },
        tabBarStyle: styles.bottomNav,
        headerShown: false, // Ensure the header is hidden for all screens
      })}
      tabBarOptions={{
        activeTintColor: "#FFA500",
        inactiveTintColor: "#000",
        showLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Diagnostics" component={DiagnosticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: responsiveHeight(2),
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default HomeTabs;
