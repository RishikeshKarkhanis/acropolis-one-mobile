import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import * as Location from "expo-location";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../services/api";

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

  lectureCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  lectureLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },

  lectureId: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#39367B",
  },

  endButton: {
    marginTop: 24,
    backgroundColor: "#ef4444",

    paddingVertical: 14,
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#ef4444",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  endButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default function TakeAttendance() {

  const { faculty } = useAuth();
  const [currentLectureId, setCurrentLectureId] = useState("");
  const { subjectCode, semester, section, subjectType } = useLocalSearchParams();



  const endLecture = async () => {
    try {
      const response = await api.post("faculty/end-lecture-session", { lectureId: currentLectureId });
      alert(response.data.message);
      router.replace("/faculty-home");
    }
    catch (error: any) { alert(error.response?.data?.message || "Failed to end lecture"); }
  };



  useEffect(() => {
    const startLecture = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          alert("Location permission denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, });

        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        console.log({
          subjectCode: subjectCode,
          subjectType: subjectType,
          semester: semester,
          section: section,
        });

        const response = await api.post("/faculty/create-lecture-session", {
          subjectCode: subjectCode,
          semester: Number(semester),
          department: faculty?.department,
          division: Number(section),
          lectureType: subjectType,
          facultyLatitude: latitude,
          facultyLongitude: longitude
        });

        setCurrentLectureId(response.data.lectureSession.lectureId);
        alert(response.data.message);
      }
      catch (error: any) { alert(error.response?.data?.message || "Failed to create lecture"); }
    };
    startLecture();
  }, [faculty, subjectCode, semester, section, subjectType]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Navbar faculty={faculty} />

      <View style={styles.content}>
        <Text style={styles.pageTitle}>
          Active Lecture
        </Text>

        <View style={styles.lectureCard}>
          <Text style={styles.lectureLabel}>
            Lecture Code
          </Text>

          <Text style={styles.lectureId}>
            {currentLectureId}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.endButton}
          onPress={endLecture}
        >
          <Text style={styles.endButtonText}>
            End Lecture
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}