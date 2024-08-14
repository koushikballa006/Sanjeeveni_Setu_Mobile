import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import AccountScreen from "./AccountScreen"; // Import the AccountScreen

const { width, height } = Dimensions.get("window");

// Calculate responsive sizes
const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size; // Assuming design is based on 375px width

const SettingsScreen = () => {
  const [isAccountModalVisible, setAccountModalVisible] = useState(false);

  const toggleAccountModal = () => {
    setAccountModalVisible(!isAccountModalVisible);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Settings</Text>

        <TouchableOpacity style={styles.menuItem} onPress={toggleAccountModal}>
          <Icon name="user" size={responsiveFontSize(24)} color="#4CAF50" />
          <Text style={styles.menuItemText}>Account</Text>
          <Icon
            name="chevron-right"
            size={responsiveFontSize(18)}
            color="#000"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="bell" size={responsiveFontSize(24)} color="#4CAF50" />
          <Text style={styles.menuItemText}>Notifications</Text>
          <Icon
            name="chevron-right"
            size={responsiveFontSize(18)}
            color="#000"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="lock" size={responsiveFontSize(24)} color="#4CAF50" />
          <Text style={styles.menuItemText}>Privacy</Text>
          <Icon
            name="chevron-right"
            size={responsiveFontSize(18)}
            color="#000"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon
            name="info-circle"
            size={responsiveFontSize(24)}
            color="#4CAF50"
          />
          <Text style={styles.menuItemText}>About</Text>
          <Icon
            name="chevron-right"
            size={responsiveFontSize(18)}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAccountModalVisible}
        onRequestClose={toggleAccountModal}
      >
        <AccountScreen onClose={toggleAccountModal} />
      </Modal>
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
    padding: responsiveWidth(4),
  },
  header: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginVertical: responsiveHeight(2),
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: responsiveWidth(4),
    marginHorizontal: responsiveWidth(2),
    marginVertical: responsiveHeight(1),
    borderRadius: 10,
  },
  menuItemText: {
    flex: 1,
    marginLeft: responsiveWidth(4),
    fontSize: responsiveFontSize(16),
  },
});

export default SettingsScreen;
