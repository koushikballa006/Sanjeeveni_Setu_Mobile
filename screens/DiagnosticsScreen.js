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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LineChart, BarChart } from "react-native-chart-kit";

const { width, height } = Dimensions.get("window");

const responsiveWidth = (percent) => (width * percent) / 100;
const responsiveHeight = (percent) => (height * percent) / 100;
const responsiveFontSize = (size) => (width / 375) * size;

const DiagnosticsScreen = () => {
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [glucoseLevel, setGlucoseLevel] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [date, setDate] = useState("");
  const [previousMetrics, setPreviousMetrics] = useState([]);

  useEffect(() => {
    fetchPreviousMetrics();
  }, []);

  const fetchPreviousMetrics = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.get(
        `http://172.20.10.3:8000/api/health-metrics/health-metrics/${userId}`,
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
        "http://172.20.10.3:8000/api/health-metrics/health-metric",
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

      // Clear input fields
      setBloodPressure("");
      setHeartRate("");
      setGlucoseLevel("");
      setCholesterol("");
      setDate("");

      // Fetch the updated metrics
      await fetchPreviousMetrics();
      Alert.alert("Success", "Health metrics submitted and updated.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit health metrics");
    }
  };

  const prepareChartData = (metrics) => {
    const labels = metrics.map((metric) => metric.date.slice(5)); // Use only month and day
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

    const chartConfig = {
      backgroundColor: "#ffffff",
      backgroundGradientFrom: "#ffffff",
      backgroundGradientTo: "#ffffff",
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
    };

    return (
      <View style={styles.chartsContainer}>
        <Text style={styles.chartTitle}>Blood Pressure</Text>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.bloodPressureSystolic,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: chartData.bloodPressureDiastolic,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: ["Systolic", "Diastolic"],
          }}
          width={responsiveWidth(90)}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Heart Rate</Text>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: [{ data: chartData.heartRates }],
          }}
          width={responsiveWidth(90)}
          height={220}
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
            labels: chartData.labels,
            datasets: [{ data: chartData.glucoseLevels }],
          }}
          width={responsiveWidth(90)}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
          }}
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Cholesterol</Text>
        <BarChart
          data={{
            labels: chartData.labels,
            datasets: [{ data: chartData.cholesterolLevels }],
          }}
          width={responsiveWidth(90)}
          height={220}
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
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.closeButton}>
        <Icon name="times" size={responsiveFontSize(24)} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.header}>Health Metrics</Text>

      <Text style={styles.label}>Blood Pressure:</Text>
      <TextInput
        value={bloodPressure}
        onChangeText={setBloodPressure}
        placeholder="e.g., 120/80"
        keyboardType="default"
        style={styles.input}
      />

      <Text style={styles.label}>Heart Rate:</Text>
      <TextInput
        value={heartRate}
        onChangeText={(text) => setHeartRate(Number(text))}
        placeholder="e.g., 72"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Glucose Level:</Text>
      <TextInput
        value={glucoseLevel}
        onChangeText={(text) => setGlucoseLevel(Number(text))}
        placeholder="e.g., 90"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Cholesterol:</Text>
      <TextInput
        value={cholesterol}
        onChangeText={(text) => setCholesterol(Number(text))}
        placeholder="e.g., 180"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Date:</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="e.g., 2024-08-21"
        keyboardType="default"
        style={styles.input}
      />

      <Button title="Submit" onPress={handleSubmit} />

      {renderCharts()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveWidth(5),
    backgroundColor: "#F0F8FF",
  },
  closeButton: {
    position: "absolute",
    top: responsiveHeight(3),
    right: responsiveWidth(5),
    zIndex: 1,
  },
  header: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: responsiveHeight(2),
  },
  label: {
    fontSize: responsiveFontSize(16),
    marginBottom: responsiveHeight(1),
  },
  input: {
    height: responsiveHeight(6),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
  },
  chartsContainer: {
    marginTop: responsiveHeight(5),
  },
  chartTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: responsiveHeight(2),
  },
  chart: {
    marginVertical: responsiveHeight(2),
  },
});

export default DiagnosticsScreen;
