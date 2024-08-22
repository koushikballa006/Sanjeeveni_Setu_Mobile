import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size;

const MyMedicationsScreen = ({ onClose }) => {
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.get(
        `https://sanjeeveni-setu-backend.onrender.com/api/prescription/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedications(response.data.prescriptions);
    } catch (error) {
      console.error("Error fetching medications:", error);
      Alert.alert("Error", "Failed to fetch medications");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMedication = async (prescriptionId) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      await axios.delete(
        `https://sanjeeveni-setu-backend.onrender.com/api/prescription/${prescriptionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMedications();
      Alert.alert("Success", "Medication deleted successfully");
    } catch (error) {
      console.error("Error deleting medication:", error);
      Alert.alert("Error", "Failed to delete medication");
    }
  };

  const confirmDelete = (prescriptionId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this medication?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteMedication(prescriptionId),
          style: "destructive",
        },
      ]
    );
  };

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => openImageModal(item.url)}
      style={styles.recordItem}
    >
      <Image source={{ uri: item.url }} style={styles.recordImage} />
      <View style={styles.recordInfo}>
        <Text style={styles.recordName}>{item.prescribedBy}</Text>
        <Text style={styles.recordDate}>
          {new Date(item.dateTime).toLocaleDateString()}
        </Text>
        <Text style={styles.recordDescription} numberOfLines={2}>
          {item.url ? "View prescription" : "No prescription image"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id)}
      >
        <Icon name="trash-alt" size={responsiveFontSize(20)} color="#FF0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="times" size={responsiveFontSize(24)} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Medications</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#4CAF50"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={medications}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
          />
        )}
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="times" size={responsiveFontSize(24)} color="#FFF" />
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: responsiveWidth(4),
    paddingTop: responsiveHeight(4),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    position: "absolute",
    left: responsiveWidth(4),
    top: responsiveHeight(6),
  },
  headerTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: responsiveHeight(2),
  },
  listContainer: {
    padding: responsiveWidth(4),
  },
  recordItem: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    alignItems: "center",
  },
  recordImage: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: 5,
  },
  recordInfo: {
    flex: 1,
    marginLeft: responsiveWidth(3),
  },
  recordName: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
  },
  recordDate: {
    fontSize: responsiveFontSize(12),
    color: "#808080",
  },
  recordDescription: {
    fontSize: responsiveFontSize(14),
    color: "#404040",
  },
  deleteButton: {
    padding: responsiveWidth(2),
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: responsiveHeight(6),
    right: responsiveWidth(4),
  },
  modalImage: {
    width: responsiveWidth(90),
    height: responsiveHeight(70),
    resizeMode: "contain",
  },
});

export default MyMedicationsScreen;
