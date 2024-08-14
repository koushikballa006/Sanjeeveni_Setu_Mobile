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

const ImageUploadScreen = ({ onClose, onUploadSuccess, initialData }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
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

    if (!name) {
      Alert.alert("Error", "Please provide a name for the document");
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
      name: "upload.jpg",
    });
    formData.append("description", description);
    formData.append("date", new Date().toISOString());
    formData.append("name", name);

    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.post(
        "http://172.20.10.2:8000/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload response:", response.data);
      
      const { newDocument } = response.data;
      
      Alert.alert(
        "Success",
        `Document uploaded successfully\n\nName: ${newDocument.name}\nDescription: ${newDocument.description}\nUploaded at: ${new Date(newDocument.date).toLocaleString()}`,
        [{ text: "OK", onPress: () => {
          onUploadSuccess(newDocument);
          onClose();
        }}]
      );
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload document. Please try again.");
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
        <Text style={styles.title}>Upload Medical Record</Text>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="file-medical" size={responsiveFontSize(50)} color="#ccc" />
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
          placeholder="Enter document name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity
            style={[styles.uploadButton, !image && styles.disabledButton]}
            onPress={uploadImage}
            disabled={!image}
          >
            <Icon name="upload" size={responsiveFontSize(20)} color="#fff" />
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
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: responsiveWidth(5),
    paddingTop: responsiveHeight(10),
  },
  closeButton: {
    position: "absolute",
    top: responsiveHeight(6),
    right: responsiveWidth(5),
    zIndex: 1,
  },
  title: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    marginBottom: responsiveHeight(3),
    color: "#4CAF50",
  },
  image: {
    width: responsiveWidth(80),
    height: responsiveWidth(60),
    borderRadius: 10,
    marginBottom: responsiveHeight(3),
  },
  imagePlaceholder: {
    width: responsiveWidth(80),
    height: responsiveWidth(60),
    borderRadius: 10,
    marginBottom: responsiveHeight(3),
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: responsiveHeight(3),
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: responsiveWidth(3),
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: responsiveWidth(40),
  },
  buttonText: {
    color: "white",
    fontSize: responsiveFontSize(16),
    marginLeft: responsiveWidth(2),
  },
  input: {
    width: "100%",
    minHeight: responsiveHeight(10),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(3),
    fontSize: responsiveFontSize(16),
  },
  uploadButton: {
    backgroundColor: "#2196F3",
    padding: responsiveWidth(3),
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: responsiveWidth(80),
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  uploadButtonText: {
    color: "white",
    fontSize: responsiveFontSize(18),
    marginLeft: responsiveWidth(2),
  },
});

export default ImageUploadScreen;