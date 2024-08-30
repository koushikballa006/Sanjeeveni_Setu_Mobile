import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import ImageUploadScreen from "../screens/ImageUploadScreen";
import HealthRecordsScreen from "../screens/HealthRecordScreen";
import PrescriptionUploadScreen from "../screens/PrescriptionUploadScreen";
import MyMedicationsScreen from "../screens/MyMedicationScreen";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size;

const BASE_URL = "https://sanjeeveni-setu-backend.onrender.com/api";
const NAME_API_URL = "https://sanjeeveni-setu-backend.onrender.com/api/users/profile";

const HomeScreen = () => {
  const [isImageUploadModalVisible, setImageUploadModalVisible] = useState(false);
  const [isHealthRecordsModalVisible, setHealthRecordsModalVisible] = useState(false);
  const [isPrescriptionUploadModalVisible, setPrescriptionUploadModalVisible] = useState(false);
  const [isMyMedicationsModalVisible, setMyMedicationsModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");
      console.log("Token:", token);
      console.log("User ID:", userId);

      if (!token || !userId) {
        throw new Error("No access token or user ID found");
      }

      const networkState = await NetInfo.fetch();
      console.log("Network state:", networkState);

      if (!networkState.isConnected) {
        throw new Error("No internet connection");
      }

      // Fetch user profile
      const profileResponse = await axios.get(`${BASE_URL}/users/userprofile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });

      console.log("Fetched user profile:", profileResponse.data);
      setProfileImage(profileResponse.data.profileImageUrl);
      
      // Fetch user name
      const nameResponse = await axios.get(`${NAME_API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });

      console.log("Fetched user name:", nameResponse.data);
      setUsername(nameResponse.data.fullName || "User");

      setError(null);
      setRetryCount(0);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
      if (retryCount < 3) {
        console.log(`Retrying... Attempt ${retryCount + 1}`);
        setRetryCount(prevCount => prevCount + 1);
        setTimeout(fetchUserData, 5000);
      } else {
        Alert.alert("Error", `Failed to fetch user data: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const toggleImageUploadModal = () => {
    setImageUploadModalVisible(!isImageUploadModalVisible);
  };

  const toggleHealthRecordsModal = () => {
    setHealthRecordsModalVisible(!isHealthRecordsModalVisible);
  };

  const togglePrescriptionUploadModal = () => {
    setPrescriptionUploadModalVisible(!isPrescriptionUploadModalVisible);
  };

  const toggleMyMedicationsModal = () => {
    setMyMedicationsModalVisible(!isMyMedicationsModalVisible);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Icon
            name="heartbeat"
            size={responsiveFontSize(24)}
            color="#FF0000"
          />
          <Text style={styles.headerName}>Sanjeevni-Setu</Text>
        </View>

        <View style={styles.profileContainer}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
              <Icon name="user" size={responsiveFontSize(40)} color="#A9A9A9" />
            </View>
          )}
        </View>

        <Text style={styles.name}>{username}</Text>
        <Text style={styles.updateText}>Hi {username}!</Text>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text>Loading user profile...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome</Text>
          <View style={styles.addButtonsContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={toggleImageUploadModal}
            >
              <Icon
                name="file-medical"
                size={responsiveFontSize(24)}
                color="#4CAF50"
              />
              <Text style={styles.addButtonText}>Add Medical Record</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.addButton}
              onPress={togglePrescriptionUploadModal}
            >
              <Icon
                name="pills"
                size={responsiveFontSize(24)}
                color="#4CAF50"
              />
              <Text style={styles.addButtonText}>Add Prescription</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={toggleHealthRecordsModal}
        >
          <Icon
            name="file-medical"
            size={responsiveFontSize(24)}
            color="#4CAF50"
          />
          <Text style={styles.menuItemText}>My Health Record</Text>
          <Icon
            name="chevron-right"
            size={responsiveFontSize(18)}
            color="#000"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={toggleMyMedicationsModal}
        >
          <Icon name="pills" size={responsiveFontSize(24)} color="#4CAF50" />
          <Text style={styles.menuItemText}>My Medications</Text>
          <Icon
            name="chevron-right"
            size={responsiveFontSize(18)}
            color="#000"
          />
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isImageUploadModalVisible}
        onRequestClose={toggleImageUploadModal}
      >
        <ImageUploadScreen onClose={toggleImageUploadModal} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPrescriptionUploadModalVisible}
        onRequestClose={togglePrescriptionUploadModal}
      >
        <PrescriptionUploadScreen onClose={togglePrescriptionUploadModal} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isMyMedicationsModalVisible}
        onRequestClose={toggleMyMedicationsModal}
      >
        <MyMedicationsScreen onClose={toggleMyMedicationsModal} />
      </Modal>

      {isHealthRecordsModalVisible && (
        <HealthRecordsScreen onClose={toggleHealthRecordsModal} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: responsiveWidth(4),
  },
  headerName: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#4CAF50",
    marginLeft: responsiveWidth(2),
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: responsiveHeight(3),
  },
  profileImage: {
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    borderRadius: responsiveWidth(17.5),
  },
  profileImagePlaceholder: {
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    textAlign: "center",
  },
  updateText: {
    fontSize: responsiveFontSize(12),
    textAlign: "center",
    color: "#808080",
    marginBottom: responsiveHeight(2),
  },
  loadingContainer: {
    padding: responsiveWidth(4),
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffcccb',
    padding: responsiveWidth(4),
    marginHorizontal: responsiveWidth(2),
    marginTop: responsiveHeight(2),
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#d8000c',
    fontSize: responsiveFontSize(14),
    marginBottom: responsiveHeight(1),
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    padding: responsiveWidth(2),
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(14),
  },
  card: {
    backgroundColor: "#FFF",
    padding: responsiveWidth(4),
    marginHorizontal: responsiveWidth(2),
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
  },
  cardTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    marginBottom: responsiveHeight(2),
    textAlign: "center",
  },
  addButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: responsiveWidth(4),
    marginHorizontal: responsiveWidth(1),
    borderRadius: 10,
  },
  addButtonText: {
    flex: 1,
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(16),
  },
  separator: {
    width: 1,
    height: responsiveHeight(6),
    backgroundColor: "#E0E0E0",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: responsiveWidth(4),
    marginHorizontal: responsiveWidth(2),
    marginTop: responsiveHeight(2),
    borderRadius: 10,
  },
  menuItemText: {
    flex: 1,
    marginLeft: responsiveWidth(4),
    fontSize: responsiveFontSize(16),
  },
});

export default HomeScreen;