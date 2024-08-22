import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size;

const AccountScreen = ({ onClose, userId }) => {
  const [userData, setUserData] = useState({});
  const [qrImageUrl, setQrImageUrl] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const userId = await AsyncStorage.getItem("userId");
        console.log(token);
        const profileResponse = await axios.get(
          `https://sanjeeveni-setu-backend.onrender.com/api/users/profile/${userId}`,
          {
            headers: {
              //   "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(profileResponse.data);

        const qrResponse = await axios.get(
          `https://sanjeeveni-setu-backend.onrender.com/api/users/get-qr-code/${userId}`,
          {
            headers: {
              //   "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQrImageUrl(qrResponse.data.qrImageUrl);
      } catch (error) {
        console.error("Error fetching user data or QR code:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="times" size={responsiveFontSize(24)} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.header}>Account Details</Text>
      <AadharCard userData={userData} qrImageUrl={qrImageUrl} />
    </View>
  );
};

const AadharCard = ({ userData, qrImageUrl }) => (
  <View style={styles.cardContainer}>
    <Text style={styles.cardText}>Name: {userData.fullName}</Text>
    <Text style={styles.cardText}>Gender: {userData.gender}</Text>
    <Text style={styles.cardText}>
      Date of Birth: {new Date(userData.dateOfBirth).toLocaleDateString()}
    </Text>
    {qrImageUrl && <Image source={{ uri: qrImageUrl }} style={styles.qrCode} />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveWidth(5),
    backgroundColor: "#F0F8FF",
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#FF6347",
    borderRadius: 50,
    padding: responsiveWidth(2),
    marginTop: responsiveHeight(2),
  },
  header: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginVertical: responsiveHeight(3),
  },
  cardContainer: {
    padding: responsiveWidth(4),
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    alignItems: "center",
    marginTop: responsiveHeight(3),
  },
  cardText: {
    fontSize: responsiveFontSize(18),
    marginBottom: responsiveHeight(1),
    color: "#333333",
  },
  qrCode: {
    width: responsiveWidth(50),
    height: responsiveWidth(50),
    marginTop: responsiveHeight(2),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
});

export default AccountScreen;
