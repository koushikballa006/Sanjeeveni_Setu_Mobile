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

const HealthRecordsScreen = ({ onClose }) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId"); // Assuming you store the userId
      const response = await axios.get(
        `http://172.20.10.2:8000/api/documents/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecords(response.data.documents);
    } catch (error) {
      console.error("Error fetching records:", error);
      Alert.alert("Error", "Failed to fetch health records");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecord = async (documentId) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      await axios.delete(
        `http://172.20.10.2:8000/api/documents/${documentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRecords(); // Refresh the list after deletion
      Alert.alert("Success", "Record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      Alert.alert("Error", "Failed to delete record");
    }
  };

  const confirmDelete = (documentId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteRecord(documentId),
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
        <Text style={styles.recordName}>{item.docname}</Text>
        <Text style={styles.recordDate}>
          {new Date(item.dateTime).toLocaleDateString()}
        </Text>
        <Text style={styles.recordDescription} numberOfLines={2}>
          {item.description}
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
          <Text style={styles.headerTitle}>My Health Records</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#4CAF50"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={records}
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
    paddingTop: responsiveHeight(4), // Increased paddingTop for more spacing
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    position: "absolute",
    left: responsiveWidth(4),
    top: responsiveHeight(6), // Adjusted to align with the increased padding
  },
  headerTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: responsiveHeight(2), // Added marginTop to move the title lower
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

export default HealthRecordsScreen;
