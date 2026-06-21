import { useAuth } from "@/contexts/AuthContext";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import MenuItem from "../components/MenuItem/MenuItem";
import Navbar from "../components/Navbar/Navbar";
import { api } from "../services/api";

export default function FacultyDashboard() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await api.get("/faculty/me");
        setUser(response.data.faculty);
      }
      catch (error: any) { console.log(error.response?.data || error.message); router.replace("/"); }
      finally { setLoading(false) }
    };
    fetchFaculty();
  }, [setUser]);

  const goToAssignedSubjects = () => {
    router.push("/assigned-subjects");
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      router.replace("/");
    } 
    catch (error) {console.log(error) }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Navbar faculty={user} />

      <View style={styles.menuContainer}>
        <MenuItem title="Take Attendance" onPress={goToAssignedSubjects} />
        <MenuItem title="Logout" onPress={handleLogout} textColor="red" />
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