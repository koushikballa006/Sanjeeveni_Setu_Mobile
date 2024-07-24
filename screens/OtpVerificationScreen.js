import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  ScrollView,
} from "react-native";
import { Button, Text } from "react-native-elements";
import { auth } from "../firebase";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";

const OtpVerificationScreen = ({ route, navigation }) => {
  const { verificationId, phoneNumber } = route.params;
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");

  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    let newVerificationCode = verificationCode.split("");
    newVerificationCode[index] = text;
    setVerificationCode(newVerificationCode.join(""));

    // Move focus to the next input
    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const confirmVerificationCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await signInWithCredential(auth, credential);
      setMessage("Phone number verified successfully.");
      // Navigate to the registration screen
      navigation.navigate("Registration");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Verify {phoneNumber}</Text>
        <View style={styles.otpContainer}>
          {[...Array(6)].map((_, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={verificationCode[index]}
              onChangeText={(text) => handleChange(text, index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
            />
          ))}
        </View>
        <Button
          title="Confirm Verification Code"
          onPress={confirmVerificationCode}
          buttonStyle={styles.button}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#008000", // Green color
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#000",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#008000", // Green color
    borderRadius: 5,
    width: 40,
    height: 40,
    textAlign: "center",
    fontSize: 18,
    color: "#000",
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#008000",
    borderRadius: 5,
  },
  message: {
    marginTop: 20,
    textAlign: "center",
    color: "#d9534f",
  },
});

export default OtpVerificationScreen;
