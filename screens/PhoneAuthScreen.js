import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Button, Text } from "react-native-elements";
import { auth } from "../firebase";
import { PhoneAuthProvider } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebaseConfig from "../firebase";

const countryCodes = [
  { label: "+1 (USA)", value: "+1" },
  { label: "+91 (India)", value: "+91" },
  { label: "+44 (UK)", value: "+44" },
  { label: "+61 (Australia)", value: "+61" },
  { label: "+81 (Japan)", value: "+81" },
  { label: "+86 (China)", value: "+86" },
  // Add more country codes as needed
];

const PhoneAuthScreen = ({ navigation }) => {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const recaptchaVerifier = useRef(null);

  const sendVerificationCode = async () => {
    const fullPhoneNumber = countryCode + phoneNumber;
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        fullPhoneNumber,
        recaptchaVerifier.current
      );
      navigation.navigate("OtpVerification", {
        verificationId,
        phoneNumber: fullPhoneNumber,
      });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
        <Text style={styles.title}>Mobile Verification</Text>
        <View style={styles.phoneInputContainer}>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setCountryCode(value)}
              items={countryCodes}
              style={pickerSelectStyles}
              value={countryCode}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#aaa"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
        <Button
          title="Send Verification Code"
          onPress={sendVerificationCode}
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
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#000000", // Green color
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
  },
  pickerContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 2,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: "#000",
  },
  button: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#008000", // Green color
    borderRadius: 5,
  },
  message: {
    marginTop: 20,
    textAlign: "center",
    color: "#d9534f",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default PhoneAuthScreen;
