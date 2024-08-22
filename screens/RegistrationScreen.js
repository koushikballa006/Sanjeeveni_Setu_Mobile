import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size;

const RegistrationScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+1"); // Default country code
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters long");
      return;
    }

    const userDetails = {
      username: email,
      password,
      email,
      fullName: `${firstName} ${lastName}`,
      dateOfBirth: dob.toISOString().split("T")[0],
      gender,
      phoneNumber: `${countryCode}${phoneNumber}`,
      address,
    };

    try {
      console.log("Sending request to API with details:", userDetails);
      const response = await axios.post(
        "https://sanjeeveni-setu-backend.onrender.com/api/users/register",
        userDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response data:", response.data);

      // Extract userId from the response
      const { userId } = response.data;

      // Navigate to OTP Verification Screen and pass userId and user details
      navigation.navigate("OtpVerification", { userId, ...userDetails });

      Alert.alert("Success", "Registration successful. Please verify OTP.");
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        Alert.alert(
          "Error",
          error.response.data.message || "An error occurred during registration"
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

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Registration</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <View style={styles.dateInputContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="Date of Birth"
              value={dob ? dob.toDateString() : ""}
              editable={false}
            />
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.iconContainer}
            >
              <Icon
                name="calendar"
                size={responsiveFontSize(24)}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date(2024, 12, 31)}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
          <RNPickerSelect
            style={pickerSelectStyles}
            onValueChange={(value) => setGender(value)}
            placeholder={{ label: "Select Gender", value: null }}
            items={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
              <RNPickerSelect
                onValueChange={(value) => setCountryCode(value)}
                placeholder={{ label: "+1", value: "+1" }} // Default country code
                items={[
                  { label: "+1", value: "+1" },
                  { label: "+44", value: "+44" },
                  { label: "+91", value: "+91" },
                  // Add more country codes as needed
                ]}
                style={pickerSelectCountryCodeStyles}
              />
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          {/* New "Already a user? Login" text */}
          <View style={styles.loginTextContainer}>
            <Text style={styles.alreadyUserText}>Already a user? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLinkText}>Login</Text>
            </TouchableOpacity>
          </View>
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
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: responsiveHeight(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
  },
  dateInput: {
    flex: 1,
    height: "100%",
    fontSize: responsiveFontSize(16),
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(2),
  },
  phoneInputContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: responsiveHeight(2),
  },
  countryCodeContainer: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginRight: responsiveWidth(2),
  },
  phoneInput: {
    flex: 3,
    height: responsiveHeight(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(16),
  },
  registerButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(8),
    alignItems: "center",
    marginTop: responsiveHeight(2),
  },
  registerButtonText: {
    color: "#fff",
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
  },
  loginTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveHeight(2),
  },
  alreadyUserText: {
    fontSize: responsiveFontSize(16),
    color: "gray",
  },
  loginLinkText: {
    fontSize: responsiveFontSize(16),
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    height: responsiveHeight(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(16),
  },
  inputAndroid: {
    width: "100%",
    height: responsiveHeight(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(16),
  },
});

const pickerSelectCountryCodeStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    height: responsiveHeight(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(16),
  },
  inputAndroid: {
    width: "100%",
    height: responsiveHeight(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(16),
  },
});

export default RegistrationScreen;
