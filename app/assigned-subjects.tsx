import MenuItem from "@/components/MenuItem/MenuItem";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { FacultySubjectMapping } from "@/types/FacultySubjectMapping";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import { api } from "../services/api";

export default function AssignedSubjects() {
  const [subjects, setSubjects] = useState<FacultySubjectMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get("/faculty/assigned-subjects");
        setSubjects(response.data.subjects);
      }
      catch (error: any) {console.log(error.response?.data || error.message); router.replace("/");}
      finally { setLoading(false) }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />
      <Navbar faculty={user} />

      <Text style={styles.pageTitle}>Assigned Subjects</Text>

      {subjects.map((subject) => (
        <MenuItem
          key={subject.mappingId}
          title={subject.subjectCode}
          subtitle={[
            `Semester: ${subject.semester}`,
            `Section: ${subject.section}`,
            `Type: ${subject.subjectType === "T" ? "Theory" : "Practical"}`,
          ]}
          onPress={() => router.push({
            pathname: "/take-attendance",
            params: {
              subjectCode: subject.subjectCode,
              semester: subject.semester.toString(),
              section: subject.section.toString(),
              subjectType: subject.subjectType,
            }
          })}
        />
      ))}

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/faculty-home")}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc"
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 20
  },

  backButton: {
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 12,
  },

  backButtonText: {
    textAlign: "center",
    color: "#39367B",
    fontSize: 16,
    fontWeight: "600",
  },
});