import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LineChart, BarChart } from "react-native-chart-kit";
import { useTheme } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => Math.round((width / 375) * size);

const DiagnosticsScreen = () => {
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [glucoseLevel, setGlucoseLevel] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [date, setDate] = useState("");
  const [previousMetrics, setPreviousMetrics] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme(); // For theming

  useEffect(() => {
    fetchPreviousMetrics();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, [modalVisible]);

  const fetchPreviousMetrics = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.get(
        `https://sanjeeveni-setu-backend.onrender.com/api/health-metrics/health-metrics/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (Array.isArray(response.data.healthMetrics)) {
        setPreviousMetrics(response.data.healthMetrics);
      } else {
        console.error("Unexpected response format:", response.data);
        setPreviousMetrics([]);
      }
    } catch (error) {
      console.error("Error fetching previous health metrics:", error);
      setPreviousMetrics([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No access token found");
        return;
      }

      await axios.post(
        "https://sanjeeveni-setu-backend.onrender.com/api/health-metrics/health-metric",
        {
          bloodPressure,
          heartRate,
          glucoseLevel,
          cholesterol,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBloodPressure("");
      setHeartRate("");
      setGlucoseLevel("");
      setCholesterol("");
      setDate("");
      setModalVisible(false);

      await fetchPreviousMetrics();
      Alert.alert("Success", "Health metrics submitted and updated.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit health metrics");
    }
  };

  const prepareChartData = (metrics) => {
    const labels = metrics.map((metric) => metric.date.slice(5));
    const bloodPressureSystolic = metrics.map((metric) =>
      parseInt(metric.bloodPressure.split("/")[0])
    );
    const bloodPressureDiastolic = metrics.map((metric) =>
      parseInt(metric.bloodPressure.split("/")[1])
    );
    const heartRates = metrics.map((metric) => metric.heartRate);
    const glucoseLevels = metrics.map((metric) => metric.glucoseLevel);
    const cholesterolLevels = metrics.map((metric) => metric.cholesterol);

    return {
      labels,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRates,
      glucoseLevels,
      cholesterolLevels,
    };
  };

  const renderCharts = () => {
    if (!previousMetrics || previousMetrics.length === 0) return null;

    const chartData = prepareChartData(previousMetrics);
    const chartWidth = responsiveWidth(90);
    const chartHeight = responsiveHeight(30);

    const calculateDataPoints = () => {
      const maxDataPoints = Math.floor(chartWidth / 50);
      return Math.min(chartData.labels.length, maxDataPoints);
    };

    const chartConfig = {
      backgroundColor: colors.background,
      backgroundGradientFrom: colors.background,
      backgroundGradientTo: colors.background,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#fff",
      },
    };

    return (
      <View style={styles.chartsContainer}>
        <Text style={styles.chartTitle}>Blood Pressure</Text>
        <LineChart
          data={{
            labels: chartData.labels.slice(-calculateDataPoints()),
            datasets: [
              {
                data: chartData.bloodPressureSystolic.slice(
                  -calculateDataPoints()
                ),
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: chartData.bloodPressureDiastolic.slice(
                  -calculateDataPoints()
                ),
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: ["Systolic", "Diastolic"],
          }}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Heart Rate</Text>
        <LineChart
          data={{
            labels: chartData.labels.slice(-calculateDataPoints()),
            datasets: [
              { data: chartData.heartRates.slice(-calculateDataPoints()) },
            ],
          }}
          width={chartWidth}
          height={chartHeight}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Glucose Level</Text>
        <BarChart
          data={{
            labels: chartData.labels.slice(-calculateDataPoints()),
            datasets: [
              { data: chartData.glucoseLevels.slice(-calculateDataPoints()) },
            ],
          }}
          width={chartWidth}
          height={chartHeight}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
          }}
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Cholesterol</Text>
        <BarChart
          data={{
            labels: chartData.labels.slice(-calculateDataPoints()),
            datasets: [
              {
                data: chartData.cholesterolLevels.slice(-calculateDataPoints()),
              },
            ],
          }}
          width={chartWidth}
          height={chartHeight}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Health Metrics</Text>

        <TouchableOpacity
          style={styles.addMetricsButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addMetricsButtonText}>Add Health Metrics+</Text>
        </TouchableOpacity>

        {renderCharts()}

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Icon
                    name="times"
                    size={responsiveFontSize(24)}
                    color="#000000"
                  />
                </TouchableOpacity>

                <Text style={styles.modalHeader}>Enter Health Metrics</Text>

                <Text style={styles.label}>Blood Pressure:</Text>
                <TextInput
                  value={bloodPressure}
                  onChangeText={(text) => setBloodPressure(text)}
                  placeholder="e.g., 120/80"
                  keyboardType="default"
                  style={styles.input}
                />

                <Text style={styles.label}>Heart Rate:</Text>
                <TextInput
                  value={heartRate.toString()}
                  onChangeText={(text) => setHeartRate(Number(text))}
                  placeholder="e.g., 72"
                  keyboardType="numeric"
                  style={styles.input}
                />

                <Text style={styles.label}>Glucose Level:</Text>
                <TextInput
                  value={glucoseLevel.toString()}
                  onChangeText={(text) => setGlucoseLevel(Number(text))}
                  placeholder="e.g., 90"
                  keyboardType="numeric"
                  style={styles.input}
                />

                <Text style={styles.label}>Cholesterol:</Text>
                <TextInput
                  value={cholesterol.toString()}
                  onChangeText={(text) => setCholesterol(Number(text))}
                  placeholder="e.g., 180"
                  keyboardType="numeric"
                  style={styles.input}
                />

                <Text style={styles.label}>Date:</Text>
                <TextInput
                  value={date}
                  placeholder="e.g., 2024-08-21"
                  keyboardType="default"
                  style={styles.input}
                  editable={false}
                />

                <View style={styles.submitButtonContainer}>
                  <Button title="Submit" onPress={handleSubmit} />
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: responsiveWidth(5),
  },
  header: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: responsiveHeight(2),
  },
  addMetricsButton: {
    alignSelf: "flex-end",
    marginBottom: responsiveHeight(2),
  },
  addMetricsButtonText: {
    fontSize: responsiveFontSize(16),
    color: "#007bff",
  },
  chartsContainer: {
    alignItems: "center",
  },
  chartTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    marginTop: responsiveHeight(2),
  },
  chart: {
    marginVertical: responsiveHeight(2),
    borderRadius: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    width: responsiveWidth(100),
  },
  modalContent: {
    width: responsiveWidth(90),
    padding: responsiveWidth(5),
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  modalHeader: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    marginBottom: responsiveHeight(2),
    textAlign: "center",
  },
  label: {
    fontSize: responsiveFontSize(16),
    alignSelf: "flex-start",
    marginBottom: responsiveHeight(1),
  },
  input: {
    width: "100%",
    padding: responsiveWidth(2),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: responsiveHeight(2),
    fontSize: responsiveFontSize(14),
  },
  closeButton: {
    position: "absolute",
    top: responsiveHeight(1),
    right: responsiveWidth(1),
    zIndex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(2),
  },
  submitButtonContainer: {
    width: "100%",
    marginTop: responsiveHeight(2),
  },
});

export default DiagnosticsScreen;
