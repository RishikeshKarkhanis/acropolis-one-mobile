import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import axios from "axios";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [attendanceCode, setAttendanceCode] = useState("");

  const [showAttendanceView, setShowAttendanceView] = useState(false);

  const [attendanceData, setAttendanceData] = useState<{
    totalLectures: number; attendedLectures: number;
    attendancePercentage: number | string;
  } | null>(null);



  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/student/me",
          {
            withCredentials: true,
          }
        );

        setName(response.data.student.name);
      } catch (error: any) {
        console.log(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const handleAttendanceSubmit = async () => {
    try {

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      const response = await axios.post(
        "http://localhost:3000/student/mark-attendance",
        {
          lectureId: attendanceCode,
          studentLatitude: latitude,
          studentLongitude: longitude
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      alert(response.data.message || "Attendance Marked Successfully!");

      setAttendanceCode("");
      setShowAttendanceForm(false);
    } catch (error: any) {
      console.log(error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
        "Failed to mark attendance"
      );
    }
  };

  const fetchAttendance = async () => {
    try {

      const response = await axios.get("http://localhost:3000/student/attendance", { withCredentials: true, });
      setAttendanceData(response.data);
      setShowAttendanceView(true);
    }
    catch (error: any) {
      console.log(error.response?.data || error.message);
      alert("Failed to fetch attendance");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Navbar */}

      <View style={styles.navbar}>
        <Text style={styles.welcomeText}>
          Welcome, {name}
        </Text>
      </View>

      {/* Content */}

      <View style={styles.menuContainer}>
        {!showAttendanceForm && !showAttendanceView ? (

          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowAttendanceForm(true)}
            >
              <Text style={styles.menuText}>
                Mark Attendance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={fetchAttendance}
            >
              <Text style={styles.menuText}>
                View Attendance
              </Text>
            </TouchableOpacity>
          </>

        ) : showAttendanceView ? (

          <View style={styles.formContainer}>

            <Text style={styles.formTitle}>
              Attendance Summary
            </Text>

            <Text style={styles.menuText}>
              Percentage: {attendanceData?.attendancePercentage}%
            </Text>

            <Text style={styles.menuText}>
              Attended Lectures: {attendanceData?.attendedLectures}
            </Text>

            <Text style={styles.menuText}>
              Total Lectures: {attendanceData?.totalLectures}
            </Text>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setShowAttendanceView(false);
              }}
            >
              <Text style={styles.backButtonText}>
                Back
              </Text>
            </TouchableOpacity>

          </View>

        ) : (

          <View style={styles.formContainer}>

            <Text style={styles.formTitle}>
              Mark Attendance
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Attendance Code"
              value={attendanceCode}
              onChangeText={setAttendanceCode}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleAttendanceSubmit}
            >
              <Text style={styles.buttonText}>
                Submit Attendance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setShowAttendanceForm(false);
                setAttendanceCode("");
              }}
            >
              <Text style={styles.backButtonText}>
                Back
              </Text>
            </TouchableOpacity>

          </View>

        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  navbar: {
    backgroundColor: "#39367B",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  welcomeText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  menuContainer: {
    padding: 20,
  },

  menuItem: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  menuText: {
    fontSize: 16,
    fontWeight: "600",
  },

  formContainer: {
    marginTop: 10,
  },

  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0f172a",
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

  button: {
    backgroundColor: "#39367B",
    paddingVertical: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
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