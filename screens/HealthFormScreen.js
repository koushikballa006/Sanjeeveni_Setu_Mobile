import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HealthFormScreen = ({ navigation }) => {
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [primaryCarePhysician, setPrimaryCarePhysician] = useState("");
  const [surgeries, setSurgeries] = useState("");
  const [pastMedicalHistory, setPastMedicalHistory] = useState("");
  const [communicableDiseases, setCommunicableDiseases] = useState("");
  const [relatives, setRelatives] = useState([
    { name: "", relation: "", phoneNumber: "" },
  ]);

  const handleSubmit = async () => {
    const patientProfile = {
      bloodType,
      allergies: allergies.split(","),
      primaryCarePhysician,
      surgeries: surgeries.split(","),
      pastMedicalHistory: pastMedicalHistory.split(","),
      communicableDiseases: communicableDiseases.split(","),
      relatives,
    };

    try {
      const token = await AsyncStorage.getItem("accessToken");
      // console.log(token)

      await axios.post(
        "http://172.20.10.2:8000/api/users/userprofile/create",
        patientProfile,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.put(
        "http://172.20.10.2:8000/api/users/update-profile",
        { isHealthFormCompleted: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.post(
        "http://172.20.10.2:8000/api/users/generate-qr-code",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Health information submitted successfully.");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to submit health information.");
    }
  };

  const handleRelativeChange = (index, key, value) => {
    const newRelatives = [...relatives];
    newRelatives[index][key] = value;
    setRelatives(newRelatives);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Health Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Blood Type"
          value={bloodType}
          onChangeText={setBloodType}
        />

        <TextInput
          style={styles.input}
          placeholder="Allergies (comma separated)"
          value={allergies}
          onChangeText={setAllergies}
        />

        <TextInput
          style={styles.input}
          placeholder="Primary Care Physician"
          value={primaryCarePhysician}
          onChangeText={setPrimaryCarePhysician}
        />

        <TextInput
          style={styles.input}
          placeholder="Surgeries (comma separated)"
          value={surgeries}
          onChangeText={setSurgeries}
        />

        <TextInput
          style={styles.input}
          placeholder="Past Medical History (comma separated)"
          value={pastMedicalHistory}
          onChangeText={setPastMedicalHistory}
        />

        <TextInput
          style={styles.input}
          placeholder="Communicable Diseases (comma separated)"
          value={communicableDiseases}
          onChangeText={setCommunicableDiseases}
        />

        {relatives.map((relative, index) => (
          <View key={index} style={styles.relativeContainer}>
            <TextInput
              style={styles.input}
              placeholder={`Relative Name`}
              value={relative.name}
              onChangeText={(text) => handleRelativeChange(index, "name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder={`Relation`}
              value={relative.relation}
              onChangeText={(text) =>
                handleRelativeChange(index, "relation", text)
              }
            />
            <TextInput
              style={styles.input}
              placeholder={`Phone Number`}
              value={relative.phoneNumber}
              onChangeText={(text) =>
                handleRelativeChange(index, "phoneNumber", text)
              }
            />
          </View>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            setRelatives([
              ...relatives,
              { name: "", relation: "", phoneNumber: "" },
            ])
          }
        >
          <Text style={styles.addButtonText}>Add Another Relative</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  relativeContainer: {
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    alignSelf: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HealthFormScreen;
