import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ViewAttendance() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [attendanceData, setAttendanceData] = useState<{
    totalLectures: number;
    attendedLectures: number;
    attendancePercentage: number | string;
  } | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get("/student/attendance");
        setAttendanceData(response.data);
      } catch (error: any) {
        console.log(error.response?.data || error.message);
        alert("Failed to fetch attendance");
        router.replace("/student-home");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Navbar user={user} />

      <View style={styles.content}>
        <Text style={styles.pageTitle}>Attendance Summary</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.label}>Attendance Percentage</Text>
          <Text style={styles.value}>
            {attendanceData?.attendancePercentage}%
          </Text>

          <Text style={styles.label}>Attended Lectures</Text>
          <Text style={styles.value}>
            {attendanceData?.attendedLectures}
          </Text>

          <Text style={styles.label}>Total Lectures</Text>
          <Text style={styles.value}>
            {attendanceData?.totalLectures}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/student-home")}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  content: {
    padding: 20,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 20,
  },

  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  label: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 12,
  },

  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#39367B",
  },

  backButton: {
    marginTop: 24,
    paddingVertical: 12,
  },

  backButtonText: {
    textAlign: "center",
    color: "#39367B",
    fontSize: 16,
    fontWeight: "600",
  },
});