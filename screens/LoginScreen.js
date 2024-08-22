import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size;

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      // First, remove any existing token
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("userId");

      const response = await axios.post(
        "http://172.20.10.3:8000/api/users/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assuming the backend sends the JWT token and user details in the response
      const { accessToken, isHealthFormCompleted, userId } = response.data;
      console.log(
        "Login successful, access token:",
        accessToken,
        isHealthFormCompleted,
        userId
      );

      // Store the new token
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("userId", userId);

      if (isHealthFormCompleted) {
        // Navigate to Home if health form is completed
        navigation.navigate("Home");
      } else {
        // Navigate to HealthFormScreen if health form is not completed
        navigation.navigate("HealthForm");
      }
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        Alert.alert("Error", error.response.data.message || "Login failed");
      } else if (error.request) {
        console.error("Request data:", error.request);
        Alert.alert(
          "Error",
          "No response from server. Please check your network connection."
        );
      } else {
        console.error("Error message:", error.message);
        Alert.alert("Error", "An error occurred: " + error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username or Email"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.RegisterContainer}>
          <Text style={styles.registertext}>Not a User?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
              <Text style={styles.RegisterLinkText}>Register</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: responsiveWidth(4),
  },
  RegisterContainer:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveHeight(2),
  },
  title: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: responsiveHeight(2),
  },
  registertext:{
    color:"#4CAF50",
    fontWeight: "bold",
    fontSize: responsiveFontSize(16),
  },
  RegisterLinkText:{
    fontWeight: "bold",
    fontSize: responsiveFontSize(16),
  },
  input: {
    width: "100%",
    height: responsiveHeight(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(16),
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(8),
    alignItems: "center",
    marginTop: responsiveHeight(2),
  },
  loginButtonText: {
    color: "#fff",
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
  },
});

export default LoginScreen;
