import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size; // Assuming design is based on 375px width

const MedicalReminderScreen = () => {
  const [medicineName, setMedicineName] = useState("");
  const [dose, setDose] = useState("");
  const [shape, setShape] = useState("");
  const [color, setColor] = useState("");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable notifications to use this app."
        );
      }
    };
    getPermissions();
  }, []);

  const handleAddMedicine = () => {
    if (medicineName && dose && shape && color && reminderTime) {
      const newMedicine = {
        name: medicineName,
        dose: dose,
        shape: shape,
        color: color,
        time: reminderTime,
      };
      setMedicines([...medicines, newMedicine]);
      scheduleNotification(medicineName, reminderTime);
      setMedicineName("");
      setDose("");
      setShape("");
      setColor("");
      setReminderTime(new Date());
      Alert.alert("Medicine Added", "Your medicine schedule has been added.");
    } else {
      Alert.alert("Error", "Please fill out all fields.");
    }
  };

  const scheduleNotification = async (medicineName, time) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medicine Reminder",
        body: `Time to take your medicine: ${medicineName}`,
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Medicine Reminder</Text>
        </View>

        <View style={styles.addMedicineSection}>
          <Text
            style={[styles.sectionTitle, { fontSize: responsiveFontSize(20) }]}
          >
            Add New Medicine
          </Text>
          <TextInput
            style={[styles.input, { width: responsiveWidth(80) }]}
            placeholder="Name"
            value={medicineName}
            onChangeText={setMedicineName}
          />
          <TextInput
            style={[styles.input, { width: responsiveWidth(80) }]}
            placeholder="Dose"
            value={dose}
            onChangeText={setDose}
          />
          <View
            style={[styles.pickerContainer, { width: responsiveWidth(80) }]}
          >
            <Picker
              selectedValue={shape}
              onValueChange={(itemValue) => setShape(itemValue)}
              style={styles.picker}
              prompt="Select Shape"
            >
              <Picker.Item label="Oval" value="oval" />
              <Picker.Item label="Round" value="round" />
              <Picker.Item label="Square" value="square" />
            </Picker>
          </View>
          <View
            style={[styles.pickerContainer, { width: responsiveWidth(80) }]}
          >
            <Picker
              selectedValue={color}
              onValueChange={(itemValue) => setColor(itemValue)}
              style={styles.picker}
              prompt="Select Color"
            >
              <Picker.Item label="Green" value="green" />
              <Picker.Item label="Red" value="red" />
              <Picker.Item label="Blue" value="blue" />
              <Picker.Item label="Pink" value="pink" />
            </Picker>
          </View>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={[styles.timePickerButton, { width: responsiveWidth(80) }]}
          >
            <Text style={styles.timePickerText}>Select Time</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || reminderTime;
                setShowTimePicker(false);
                setReminderTime(currentDate);
              }}
            />
          )}
          <TouchableOpacity
            style={[styles.addButton, { width: responsiveWidth(80) }]}
            onPress={handleAddMedicine}
          >
            <Text style={styles.addButtonText}>Add Schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.medicineListSection}>
          <Text
            style={[styles.sectionTitle, { fontSize: responsiveFontSize(20) }]}
          >
            This Week
          </Text>
          {medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineCard}>
              <View style={styles.medicineDetails}>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <Text style={styles.medicineDose}>{medicine.dose}</Text>
                <Text style={styles.medicineTime}>
                  {medicine.time.getHours()}:
                  {medicine.time.getMinutes() < 10 ? "0" : ""}
                  {medicine.time.getMinutes()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  header: {
    padding: responsiveWidth(5),
    backgroundColor: "#4CAF50",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#fff",
  },
  addMedicineSection: {
    padding: responsiveWidth(5),
    backgroundColor: "#fff",
    borderRadius: responsiveWidth(2),
    margin: responsiveWidth(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveWidth(1),
    elevation: responsiveWidth(1.5),
    width: "95%",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    marginBottom: responsiveWidth(3),
    color: "#4CAF50",
  },
  input: {
    borderWidth: responsiveWidth(0.27),
    borderColor: "#ccc",
    borderRadius: responsiveWidth(1.3),
    padding: responsiveWidth(2.7),
    marginBottom: responsiveWidth(4),
    backgroundColor: "#fff",
    fontSize: responsiveFontSize(16),
  },
  pickerContainer: {
    borderWidth: responsiveWidth(0.27),
    borderColor: "#ccc",
    borderRadius: responsiveWidth(1.3),
    marginBottom: responsiveWidth(4),
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        paddingLeft: responsiveWidth(2),
      },
    }),
  },
  picker: {
    height: responsiveHeight(6.7),
    width: "100%",
  },
  timePickerButton: {
    backgroundColor: "#4CAF50",
    borderRadius: responsiveWidth(1.3),
    padding: responsiveWidth(3.3),
    alignItems: "center",
    marginBottom: responsiveWidth(4),
    width: "95%",
  },
  timePickerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: responsiveWidth(1.3),
    padding: responsiveWidth(4),
    alignItems: "center",
    width: "95%",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  medicineListSection: {
    padding: responsiveWidth(5),
    width: "95%",
  },
  medicineCard: {
    backgroundColor: "#fff",
    padding: responsiveWidth(3.3),
    borderRadius: responsiveWidth(2),
    marginBottom: responsiveWidth(4),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveWidth(1),
    elevation: responsiveWidth(1.5),
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
  },
  medicineDose: {
    fontSize: responsiveFontSize(16),
    color: "#888",
  },
  medicineTime: {
    fontSize: responsiveFontSize(14),
    color: "#888",
  },
});

export default MedicalReminderScreen;
