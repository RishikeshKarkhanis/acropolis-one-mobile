import { useAuth } from "@/contexts/AuthContext";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import MenuItem from "../components/MenuItem/MenuItem";
import Navbar from "../components/Navbar/Navbar";
import { api } from "../services/api";

export default function FacultyDashboard() {
  const { faculty, setFaculty } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await api.get("faculty/me");
        setFaculty(response.data.faculty);
      } 
      catch (error: any) {console.log(error.response?.data || error.message)} 
      finally { setLoading(false) }
    };
    fetchFaculty();
  }, [setFaculty]);

  const goToAssignedSubjects = () => {
    router.push("/assigned-subjects");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Navbar faculty={faculty} />

      <View style={styles.menuContainer}>
        <MenuItem title="Take Attendance" onPress={goToAssignedSubjects}/>
        <MenuItem title="Logout" textColor="red"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  menuContainer: {
    paddingTop: 20,
  },
});