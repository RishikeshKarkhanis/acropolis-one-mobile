import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import MenuItem from "@/components/MenuItem/MenuItem";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function StudentHome() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get("/student/me");
        setUser(response.data.student);
      } catch (error: any) {
        console.log(error.response?.data || error.message);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Navbar user={user} />

      <View style={styles.menuContainer}>
        <MenuItem
          title="Mark Attendance"
          onPress={() => router.push("/mark-attendance")}
        />

        <MenuItem
          title="View Attendance"
          onPress={() => router.push("/view-attendance")}
        />

        <MenuItem
          title="Logout"
          onPress={handleLogout}
          textColor="red"
        />
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