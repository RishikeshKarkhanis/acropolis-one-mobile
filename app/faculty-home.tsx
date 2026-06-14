import axios from "axios";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

export default function FacultyDashboard() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAssignedSubjects, setShowAssignedSubjects] = useState(false);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const [showTakeAttendance, setShowTakeAttendance] = useState(false);

  const [currentLectureId, setCurrentLectureId] = useState("");

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get("http://localhost:3000/faculty/me", { withCredentials: true, });
        setName(response.data.faculty.name);
      }
      catch (error: any) { console.log(error.response?.data || error.message); }
      finally { setLoading(false); }
    };
    fetchFaculty();
  }, []);

  const fetchAssignedSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const response = await axios.get("http://localhost:3000/faculty/assigned-subjects", { withCredentials: true, });
      console.log(response.data);
      setSubjects(response.data.subjects);
      setShowTakeAttendance(false);
      setShowAssignedSubjects(true);
    }
    catch (error: any) { console.log(error.response?.data || error.message); }
    finally { setSubjectsLoading(false); }
  };

  const fetchSubjectsForAttendance = async () => {
    try {
      setSubjectsLoading(true);

      const response = await axios.get("http://localhost:3000/faculty/assigned-subjects", { withCredentials: true, });
      setSubjects(response.data.subjects);
      setShowAssignedSubjects(false);
      setShowTakeAttendance(true);
    }
    catch (error: any) { console.log(error.response?.data || error.message); }
    finally { setSubjectsLoading(false); }
  };

  const startLecture = async (subject: any) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High,});

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      const response = await axios.post("http://localhost:3000/faculty/create-lecture-session", {
        subjectCode: subject.subjectCode,
        semester: subject.semester,
        department: "AL",
        division: subject.section,
        lectureType: subject.subjectType,
        facultyLatitude: latitude,
        facultyLongitude: longitude
      },

        {
          withCredentials: true,
        }
      );

      setCurrentLectureId(response.data.lectureSession.lectureId);
      alert(response.data.message);
    }
    catch (error: any) { alert(error.response?.data?.message || "Failed to create lecture"); }
  };

  const endLecture = async () => {
    try {
      const response = await axios.post("http://localhost:3000/faculty/end-lecture-session", {
        lectureId: currentLectureId,
      }, { withCredentials: true, });

      alert(response.data.message);
      setCurrentLectureId("");
      setShowTakeAttendance(false);
    }
    catch (error: any) { alert(error.response?.data?.message || "Failed to end lecture"); }
  };

  if (loading) {
    return (<View style={styles.loader}><ActivityIndicator size="large" /></View>);
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
        {!showAssignedSubjects &&
          !showTakeAttendance ? (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={fetchAssignedSubjects}
            >
              <Text style={styles.menuText}>
                Assigned Subjects
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={fetchSubjectsForAttendance}
            >
              <Text style={styles.menuText}>
                Take Attendance
              </Text>
            </TouchableOpacity>
          </>
        ) : showAssignedSubjects ? (
          <View>
            <Text style={styles.sectionTitle}>
              Assigned Subjects
            </Text>

            {subjectsLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              subjects.map((subject) => (
                <View
                  key={subject.mappingId}
                  style={styles.subjectCard}
                >
                  <Text style={styles.subjectTitle}>
                    {subject.subjectCode}
                  </Text>

                  <Text style={styles.subjectText}>
                    Semester: {subject.semester}
                  </Text>

                  <Text style={styles.subjectText}>
                    Section: {subject.section}
                  </Text>

                  <Text style={styles.subjectText}>
                    Type:{" "}
                    {subject.subjectType === "T"
                      ? "Theory"
                      : "Practical"}
                  </Text>
                </View>
              ))
            )}

            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                setShowAssignedSubjects(false)
              }
            >
              <Text style={styles.backButtonText}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>
              Select Subject
            </Text>

            {subjectsLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.mappingId}
                  style={styles.subjectCard}
                  onPress={() => startLecture(subject)}
                >
                  <Text style={styles.subjectTitle}>
                    {subject.subjectCode}
                  </Text>

                  <Text style={styles.subjectText}>
                    Semester: {subject.semester}
                  </Text>

                  <Text style={styles.subjectText}>
                    Section: {subject.section}
                  </Text>

                  <Text style={styles.subjectText}>
                    Type:{" "}
                    {subject.subjectType === "T"
                      ? "Theory"
                      : "Practical"}
                  </Text>
                </TouchableOpacity>
              ))
            )}

            {currentLectureId ? (
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Active Lecture
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    marginBottom: 15,
                    fontSize: 16,
                  }}
                >
                  {currentLectureId}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    {
                      backgroundColor: "#ef4444",
                    },
                  ]}
                  onPress={endLecture}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    End Lecture
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setShowTakeAttendance(false);
                setCurrentLectureId("");
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
    color: "#0f172a",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0f172a",
  },

  subjectCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  subjectTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#39367B",
  },

  subjectText: {
    fontSize: 15,
    marginBottom: 4,
  },

  backButton: {
    marginTop: 10,
    paddingVertical: 12,
  },

  backButtonText: {
    textAlign: "center",
    color: "#39367B",
    fontSize: 16,
    fontWeight: "600",
  },
});