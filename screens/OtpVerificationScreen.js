import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size;

const OtpVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next field automatically
    if (text && index < 3) {
      document.querySelector(`input[name='otp${index + 1}']`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 4) {
      Alert.alert("Error", "Please enter a complete OTP");
      return;
    }

    try {
      console.log("Sending OTP to API for verification:", otpCode);
      const response = await axios.post(
        "http://172.20.10.2:8000/api/users/verify-phone-otp",
        { otp: otpCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response data:", response.data);
      navigation.navigate("Home");

      Alert.alert("Success", "OTP verified successfully");
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        Alert.alert(
          "Error",
          error.response.data.message || "OTP verification failed"
        );
      } else if (error.request) {
        console.error("Request data:", error.request);
        Alert.alert(
          "Error",
          "No response received from server. Please check your network connection."
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
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Verify OTP</Text>
          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="numeric"
                value={value}
                onChangeText={(text) => handleOtpChange(text, index)}
                name={`otp${index}`}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerifyOtp}
          >
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          </TouchableOpacity>
        </ScrollView>
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
  title: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: responsiveHeight(2),
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: responsiveHeight(2),
  },
  otpInput: {
    width: responsiveWidth(12),
    height: responsiveHeight(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: responsiveFontSize(20),
    marginHorizontal: responsiveWidth(1),
  },
  verifyButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(8),
    alignItems: "center",
    marginTop: responsiveHeight(2),
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
  },
});

export default OtpVerificationScreen;
