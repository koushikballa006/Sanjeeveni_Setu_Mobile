import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";

const { width } = Dimensions.get("window");

const MedicalAnalysisScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Nightingale Score</Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.score}>80.2</Text>
          <Text style={styles.scoreLabel}>Mild Hypertension</Text>
        </View>

        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Health Overview</Text>

          {/* Heart Rate Chart */}
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Image
                source={{
                  uri: "https://static.vecteezy.com/system/resources/previews/000/285/139/original/heart-symbol-of-love-and-valentine-s-day-flat-red-icon-isolated-on-white-background-vector-illustration-vector.jpg",
                }}
                style={styles.icon}
              />
              <Text style={styles.metricTitle}>Heart Rate</Text>
              <Text style={styles.metricValue}>95 bpm</Text>
            </View>
            <LineChart
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [{ data: [65, 70, 80, 75, 85, 95] }],
              }}
              width={width - 40}
              height={200}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          {/* Blood Pressure Chart */}
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.L1HNlO5BcPKKD-0C2CnXigHaHa?w=183&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                }}
                style={styles.icon}
              />
              <Text style={styles.metricTitle}>Blood Pressure</Text>
              <Text style={styles.metricValue}>121 mmHg</Text>
            </View>
            <BarChart
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [{ data: [110, 115, 120, 118, 122, 121] }],
              }}
              width={width - 40}
              height={200}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 26, 26, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              style={styles.chart}
            />
          </View>

          {/* Cholesterol Chart */}
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.LnYp2rjrczFFE_oVRJ9XdgHaHa?rs=1&pid=ImgDetMain",
                }}
                style={styles.icon}
              />
              <Text style={styles.metricTitle}>Cholesterol</Text>
              <Text style={styles.metricValue}>180 mg/dL</Text>
            </View>
            <ProgressChart
              data={{
                labels: ["LDL", "HDL", "Total"],
                data: [0.6, 0.7, 0.8],
              }}
              width={width - 40}
              height={200}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 136, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              style={styles.chart}
            />
          </View>

          {/* Glucose Chart */}
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.bx0yV3b8pq4DXHb-Z9a0XgHaHa?w=202&h=203&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                }}
                style={styles.icon}
              />
              <Text style={styles.metricTitle}>Glucose</Text>
              <Text style={styles.metricValue}>110 mg/dL</Text>
            </View>
            <LineChart
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [{ data: [100, 105, 110, 108, 112, 110] }],
              }}
              width={width - 40}
              height={200}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          {/* Health Breakdown Pie Chart */}
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricTitle}>Health Breakdown</Text>
            </View>
            <PieChart
              data={[
                {
                  name: "Sleep",
                  population: 25,
                  color: "#4B0082",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
                {
                  name: "Exercise",
                  population: 30,
                  color: "#00BFFF",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
                {
                  name: "Diet",
                  population: 25,
                  color: "#32CD32",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
                {
                  name: "Stress",
                  population: 20,
                  color: "#FF69B4",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
              ]}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
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
  },
  header: {
    padding: 20,
    backgroundColor: "#1EB980",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  scoreCard: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1EB980",
  },
  score: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  scoreLabel: {
    fontSize: 18,
    color: "#fff",
  },
  overviewSection: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  metricItem: {
    marginBottom: 30,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default MedicalAnalysisScreen;
