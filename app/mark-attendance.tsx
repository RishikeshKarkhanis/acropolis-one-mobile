import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import * as Location from "expo-location";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function MarkAttendance() {
  const { user } = useAuth();
  const [attendanceCode, setAttendanceCode] = useState("");

  const handleAttendanceSubmit = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      const response = await api.post("/student/mark-attendance", {
        lectureId: attendanceCode,
        studentLatitude: latitude,
        studentLongitude: longitude,
      });

      alert(response.data.message || "Attendance Marked Successfully!");

      router.replace("/student-home");
    } catch (error: any) {
      console.log(error.response?.data || error.message);

      alert(
        error.response?.data?.message || "Failed to mark attendance"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Navbar user={user} />

      <View style={styles.content}>
        <Text style={styles.pageTitle}>Mark Attendance</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Attendance Code"
          value={attendanceCode}
          onChangeText={setAttendanceCode}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAttendanceSubmit}
        >
          <Text style={styles.submitButtonText}>
            Submit Attendance
          </Text>
        </TouchableOpacity>

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

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },

  submitButton: {
    backgroundColor: "#39367B",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#39367B",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  backButton: {
    marginTop: 12,
    paddingVertical: 12,
  },

  backButtonText: {
    textAlign: "center",
    color: "#39367B",
    fontSize: 16,
    fontWeight: "600",
  },
});