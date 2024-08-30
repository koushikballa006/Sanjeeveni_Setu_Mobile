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
  Image,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';

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
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log("Image picked:", result.assets[0].uri);
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Starting form submission...");
      const formData = new FormData();
  
      console.log("Adding form data...");
      formData.append('bloodType', bloodType.trim());
      console.log('Blood Type:', bloodType.trim());
  
      const allergyArray = allergies.split(',').map(a => a.trim());
      allergyArray.forEach(allergy => formData.append('allergies', allergy));
      console.log('Allergies:', allergyArray);
  
      formData.append('primaryCarePhysician', primaryCarePhysician.trim());
      console.log('Primary Care Physician:', primaryCarePhysician.trim());
  
      const surgeryArray = surgeries.split(',').map(s => s.trim());
      surgeryArray.forEach(surgery => formData.append('surgeries', surgery));
      console.log('Surgeries:', surgeryArray);
  
      const historyArray = pastMedicalHistory.split(',').map(h => h.trim());
      historyArray.forEach(history => formData.append('pastMedicalHistory', history));
      console.log('Past Medical History:', historyArray);
  
      const diseaseArray = communicableDiseases.split(',').map(d => d.trim());
      diseaseArray.forEach(disease => formData.append('communicableDiseases', disease));
      console.log('Communicable Diseases:', diseaseArray);
  
      relatives.forEach((relative, index) => {
        formData.append(`relatives[${index}][name]`, relative.name.trim());
        formData.append(`relatives[${index}][relation]`, relative.relation.trim());
        formData.append(`relatives[${index}][phoneNumber]`, relative.phoneNumber.trim());
      });
      console.log('Relatives:', relatives);
  
      if (profileImage) {
        console.log("Appending profile image:", profileImage);
        const uriParts = profileImage.split('.');
        const fileType = uriParts[uriParts.length - 1];
  
        formData.append('profileImage', {
          uri: Platform.OS === 'ios' ? profileImage.replace('file://', '') : profileImage,
          name: `profileImage.${fileType}`,
          type: `image/${fileType}`,
        });
      } else {
        console.log("No profile image selected");
      }
  
      const token = await AsyncStorage.getItem("accessToken");
      console.log("Retrieved token:", token ? "Token exists" : "Token is null");
  
      console.log("Sending POST request to create user profile...");
      const response = await axios.post(
        "https://sanjeeveni-setu-backend.onrender.com/api/users/userprofile/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Server response:", response.data);
  
      console.log("Updating user profile...");
      await axios.put(
        "https://sanjeeveni-setu-backend.onrender.com/api/users/update-profile",
        { isHealthFormCompleted: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Generating QR code...");
      await axios.post(
        "https://sanjeeveni-setu-backend.onrender.com/api/users/generate-qr-code",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Form submission completed successfully");
      Alert.alert("Success", "Health information submitted successfully.");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error in form submission:");
      if (error.response) {
        console.error("Data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
      Alert.alert("Error", "Failed to submit health information. Please check console for details.");
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

        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.imagePlaceholder}>Select Profile Image</Text>
          )}
        </TouchableOpacity>

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
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    color: "#757575",
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