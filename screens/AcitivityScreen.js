import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size;

const MedicalReminderScreen = () => {
  const [medicineName, setMedicineName] = useState("");
  const [dose, setDose] = useState("");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserId = useCallback(async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      console.log("Stored User ID:", storedUserId);
      if (storedUserId) {
        setUserId(storedUserId);
        return storedUserId;
      } else {
        throw new Error("User ID not found");
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      Alert.alert("Error", "Failed to fetch user information. Please log in again.");
      return null;
    }
  }, []);

  const fetchMedicines = useCallback(async (id) => {
    try {
      console.log("Fetching medicines for user ID:", id);
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Access token not found");
      }
      const response = await fetch(
        `https://sanjeeveni-setu-backend.onrender.com/api/medication-reminders/user/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched medicines:", data.medicationReminders);
      setMedicines(data.medicationReminders);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      Alert.alert("Error", "Failed to fetch reminders. Please try again.");
    }
  }, []);

  const setup = useCallback(async () => {
    try {
      await getPermissions();
      const id = await fetchUserId();
      if (id) {
        await fetchMedicines(id);
      }
    } catch (error) {
      console.error("Setup error:", error);
      Alert.alert("Error", "Failed to set up the app. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserId, fetchMedicines]);

  useEffect(() => {
    setup();
  }, [setup]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await setup();
    setRefreshing(false);
  }, [setup]);

  const getPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please enable notifications to use this app."
      );
    }
  };

  const handleAddMedicine = async () => {
    if (medicineName && dose && reminderTime && userId) {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Access token not found");
        }
        const response = await fetch(
          "https://sanjeeveni-setu-backend.onrender.com/api/medication-reminders/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: userId,
              medicationName: medicineName,
              dosage: dose,
              frequency: "Once a day",
              nextDose: reminderTime.toISOString(),
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Add medicine response:", data);
        Alert.alert("Success", "Medication reminder created successfully");
        await fetchMedicines(userId);
        setMedicineName("");
        setDose("");
        setReminderTime(new Date());
        await scheduleNotification(medicineName, reminderTime);
      } catch (error) {
        console.error("Error adding medicine:", error);
        Alert.alert("Error", "Failed to create reminder. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert("Error", "Please fill out all fields.");
    }
  };

  const handleDeleteMedicine = async (reminderId) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Access token not found");
      }
      const response = await fetch(
        `https://sanjeeveni-setu-backend.onrender.com/api/medication-reminders/${reminderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Delete medicine response:", await response.json());
      await fetchMedicines(userId);
      Alert.alert("Success", "Medication reminder deleted successfully");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      Alert.alert("Error", "Failed to delete reminder. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleNotification = async (medicineName, time) => {
    try {
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
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Medicine Reminder</Text>
        </View>

        <View style={styles.addMedicineSection}>
          <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(20) }]}>
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
          <Text style={[styles.sectionTitle, { fontSize: responsiveFontSize(20) }]}>
            This Week
          </Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : medicines.length > 0 ? (
            medicines.map((medicine) => (
              <View key={medicine._id} style={styles.medicineCard}>
                <View style={styles.medicineDetails}>
                  <Text style={styles.medicineName}>{medicine.medicationName}</Text>
                  <Text style={styles.medicineDose}>{medicine.dosage}</Text>
                  <Text style={styles.medicineTime}>
                    {new Date(medicine.nextDose).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMedicine(medicine._id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noMedicinesText}>No medicines scheduled</Text>
          )}
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
  deleteButton: {
    backgroundColor: "#FF6F61",
    borderRadius: responsiveWidth(1.3),
    padding: responsiveWidth(2),
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noMedicinesText: {
    fontSize: responsiveFontSize(16),
    color: "#888",
    textAlign: "center",
    marginTop: responsiveHeight(2),
  },
});

export default MedicalReminderScreen;