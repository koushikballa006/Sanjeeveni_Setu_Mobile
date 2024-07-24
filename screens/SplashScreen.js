import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

const SplashScreen = ({ onFinish, navigation }) => {
  useEffect(() => {
    onFinish();
    navigation.navigate("Registration");
  }, [onFinish, navigation]);

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Optional: Set a background color if desired
  },
});

export default SplashScreen;
