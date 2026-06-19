import MenuItem from "@/components/MenuItem/MenuItem";
import { FacultySubjectMapping } from "@/types/FacultySubjectMapping";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import { api } from "../services/api";

const [subjects, setSubjects] = useState<FacultySubjectMapping[]>([]);
const [loading, setLoading] = useState(true);

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },

    backButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "#39367B",
        borderRadius: 8,
        alignSelf: "flex-start",
    },

    backButtonText: {
        color: "white",
        fontSize: 16,
    }
});

export default function AssignedSubject() {

    useEffect(() => {
        const fetchSubjects= async () => {
          try {
            const response = await api.get("faculty/assigned-subjects");
            setSubjects(response.data.subjects);
          }
          catch (error: any) { console.log(error.response?.data || error.message); }
          finally { setLoading(false); }
        };
        fetchSubjects();
    }, []);

    return (
        <View>
            <Text style={styles.sectionTitle}>
                Assigned Subjects
            </Text>

            {loading ? (
                <LoadingScreen />
            ) : (
                <View>
                    {subjects.map((subject: FacultySubjectMapping) => (
                        <MenuItem key={subject.mappingId} title={`${subject.subjectCode}`}
                            subtitle={[
                                `Semester: ${subject.semester}`,
                                `Section: ${subject.section}`,
                                `Type: ${subject.subjectType === "T" ? "Theory" : "Practical"}`
                            ]}
                        />
                    ))}
                </View>
            )}

        </View>
    );
}