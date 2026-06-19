import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import MenuItem from "../components/MenuItem/MenuItem";
import Navbar from "../components/Navbar/Navbar";
import { api } from "../services/api";
import { Faculty } from "../types/Faculty";
import { FacultySubjectMapping } from "../types/FacultySubjectMapping";

type ScreenMode = | "menu" | "subjects" | "attendance" | "logout";

export default function FacultyDashboard() {
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<ScreenMode>("menu");
  const [subjects, setSubjects] = useState<FacultySubjectMapping[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [currentLectureId, setCurrentLectureId] = useState("");

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await api.get("faculty/me");
        setFaculty(response.data.faculty);
      }
      catch (error: any) { console.log(error.response?.data || error.message); }
      finally { setLoading(false); }
    };
    fetchFaculty();
  }, []);

  const fetchSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const response = await api.get("/faculty/assigned-subjects");
      setSubjects(response.data.subjects);
    }
    catch (error: any) { console.log(error.response?.data || error.message); }
    finally { setSubjectsLoading(false); }
  };

  const fetchAssignedSubjects = async () => {
    await fetchSubjects();
    setMode("subjects");
  };

  const fetchSubjectsForAttendance = async () => {
    await fetchSubjects();
    setMode("attendance");
  };



  const startLecture = async (subject: FacultySubjectMapping) => {
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
        subjectCode: subject.subjectCode,
        subjectType: subject.subjectType,
        semester: subject.semester,
        section: subject.section,
      });

      const response = await api.post("/faculty/create-lecture-session", {
        subjectCode: subject.subjectCode,
        semester: subject.semester,
        department: faculty?.department,
        division: subject.section,
        lectureType: subject.subjectType,
        facultyLatitude: latitude,
        facultyLongitude: longitude
      });

      setCurrentLectureId(response.data.lectureSession.lectureId);
      alert(response.data.message);
    }
    catch (error: any) { alert(error.response?.data?.message || "Failed to create lecture"); }
  };

  const endLecture = async () => {
    try {
      const response = await api.post("faculty/end-lecture-session", { lectureId: currentLectureId });
      alert(response.data.message);
      setCurrentLectureId("");
      setMode("menu");
    }
    catch (error: any) { alert(error.response?.data?.message || "Failed to end lecture"); }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>

      {/* Navbar */}
      <Navbar faculty={faculty} />

      {/* Content */}
      <View style={styles.menuContainer}>
        {mode === "menu" ? (
          <>
            <MenuItem title="Assigned Subjects" onPress={fetchAssignedSubjects} />
            <MenuItem title="Take Attendance" onPress={fetchSubjectsForAttendance} />
            <MenuItem title="Logout" textColor="red"/>
          </>
        ) : mode === "subjects" ? (
          <View>
            <Text style={styles.sectionTitle}>
              Assigned Subjects
            </Text>

            {subjectsLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              subjects.map((subject: FacultySubjectMapping) => (
                <MenuItem
                  key={subject.mappingId}
                  title={`${subject.subjectCode}`}
                  subtitle={[
                    `Semester: ${subject.semester}`,
                    `Section: ${subject.section}`,
                    `Type: ${subject.subjectType === "T" ? "Theory" : "Practical"}`
                  ]}
                />
              ))
            )}

            <TouchableOpacity style={styles.backButton} onPress={() =>setMode("menu")}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Select Subject</Text>

            {subjectsLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              subjects.map((subject: FacultySubjectMapping) => (
                <MenuItem 
                  key={subject.mappingId} 
                  title={`${subject.subjectCode}`}

                  subtitle={
                    [`Semester: ${subject.semester}`, 
                    `Section: ${subject.section}`, 
                    `Type: ${subject.subjectType === "T" ? "Theory" : "Practical"}`]
                  }

                  onPress={() => startLecture(subject)}
                />
              ))
            )}

            {currentLectureId ? (
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold"}}>Active Lecture</Text>

                <Text style={{ marginTop: 5,  marginBottom: 15, fontSize: 16 }}>
                  {currentLectureId}
                </Text>

                <TouchableOpacity style={[ styles.menuItem, { backgroundColor: "#ef4444" }]} onPress={endLecture}>
                  <Text style={{color: "white",textAlign: "center",fontWeight: "bold"}}>
                    End Lecture
                  </Text>
                </TouchableOpacity>

              </View>
            ) : null}

            <TouchableOpacity style={styles.backButton} onPress={()=>{setMode("menu");setCurrentLectureId("");}}>
              <Text style={styles.backButtonText}>Back</Text>
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