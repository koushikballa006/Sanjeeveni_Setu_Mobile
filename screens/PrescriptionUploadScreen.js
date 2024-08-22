import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size;

const PrescriptionUploadScreen = ({
  onClose,
  onUploadSuccess,
  initialData,
}) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prescribedBy, setPrescribedBy] = useState("");
  const [dateTime, setDateTime] = useState(new Date().toISOString());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setPrescribedBy(initialData.prescribedBy || "");
      setDateTime(initialData.dateTime || new Date().toISOString());
      setImage(initialData.image || null);
    }
  }, [initialData]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    if (!name || !prescribedBy) {
      Alert.alert("Error", "Please provide the required information");
      return;
    }

    if (!description) {
      Alert.alert("Error", "Please provide a description");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("document", {
      uri: image,
      type: "image/jpeg",
      name: name + ".jpg",
    });
    formData.append("prescribedBy", prescribedBy);
    formData.append("dateTime", dateTime);

    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.post(
        "https://sanjeeveni-setu-backend.onrender.com/api/prescription/upload", // Updated endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { newPrescription } = response.data;
      Alert.alert(
        "Success",
        `Prescription uploaded successfully\n\nName: ${
          newPrescription.name
        }\nDescription: ${newPrescription.description}\nPrescribed By: ${
          newPrescription.prescribedBy
        }\nUploaded at: ${new Date(newPrescription.dateTime).toLocaleString()}`,
        [
          {
            text: "OK",
            onPress: () => {
              onUploadSuccess(newPrescription);
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload prescription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="times" size={responsiveFontSize(24)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Upload Prescription</Text>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="pills" size={responsiveFontSize(50)} color="#ccc" />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Icon name="images" size={responsiveFontSize(20)} color="#fff" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Icon name="camera" size={responsiveFontSize(20)} color="#fff" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter prescription name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter prescribed by"
          value={prescribedBy}
          onChangeText={setPrescribedBy}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  scrollContainer: {
    padding: responsiveWidth(4),
  },
  closeButton: {
    alignSelf: "flex-end",
    top: responsiveHeight(6),
    right: responsiveWidth(5),
  },
  title: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: responsiveHeight(2),
  },
  image: {
    width: "100%",
    height: responsiveHeight(30),
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
  },
  imagePlaceholder: {
    width: "100%",
    height: responsiveHeight(30),
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveHeight(2),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: responsiveHeight(2),
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: responsiveWidth(4),
    borderRadius: 10,
    marginHorizontal: responsiveWidth(1),
  },
  buttonText: {
    marginLeft: responsiveWidth(2),
    color: "#fff",
    fontSize: responsiveFontSize(16),
  },
  input: {
    backgroundColor: "#FFF",
    padding: responsiveWidth(4),
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
    fontSize: responsiveFontSize(16),
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    padding: responsiveWidth(4),
    borderRadius: 10,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: responsiveFontSize(16),
  },
});

export default PrescriptionUploadScreen;
