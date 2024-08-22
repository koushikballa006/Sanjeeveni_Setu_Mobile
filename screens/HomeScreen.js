import React, { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import ImageUploadScreen from "../screens/ImageUploadScreen";
import HealthRecordsScreen from "../screens/HealthRecordScreen";
import PrescriptionUploadScreen from "../screens/PrescriptionUploadScreen";
import MyMedicationsScreen from "../screens/MyMedicationScreen"; // Import your MyMedicationsScreen

const { width, height } = Dimensions.get("window");

// Calculate responsive sizes
const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size;

const HomeScreen = () => {
  const [isImageUploadModalVisible, setImageUploadModalVisible] = useState(false);
  const [isHealthRecordsModalVisible, setHealthRecordsModalVisible] = useState(false);
  const [isPrescriptionUploadModalVisible, setPrescriptionUploadModalVisible] = useState(false);
  const [isMyMedicationsModalVisible, setMyMedicationsModalVisible] = useState(false); // State for MyMedications modal

  const toggleImageUploadModal = () => {
    setImageUploadModalVisible(!isImageUploadModalVisible);
  };

  const toggleHealthRecordsModal = () => {
    setHealthRecordsModalVisible(!isHealthRecordsModalVisible);
  };

  const togglePrescriptionUploadModal = () => {
    setPrescriptionUploadModalVisible(!isPrescriptionUploadModalVisible);
  };

  const toggleMyMedicationsModal = () => { // Toggle function for MyMedications modal
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
          <Image
            source={{
              uri: "https://media.licdn.com/dms/image/D5603AQHf8SL1HFNrLA/profile-displayphoto-shrink_200_200/0/1719486559415?e=2147483647&v=beta&t=rdZh5XLwoLmoRn3QQmcf1ZDFYZYiOA2fkAjkXl_o9KY",
            }}
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.name}>Chris Alister</Text>
        <Text style={styles.updateText}>Hi Chris Alister</Text>

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
              onPress={togglePrescriptionUploadModal} // Open the PrescriptionUploadScreen modal
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
          onPress={toggleMyMedicationsModal} // Open the MyMedicationsScreen modal
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
        onRequestClose={toggleMyMedicationsModal} // Close the MyMedications modal
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
