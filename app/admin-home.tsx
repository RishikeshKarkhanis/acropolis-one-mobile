import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/me",
          {
            withCredentials: true,
          }
        );

        console.log(response.data);

        setName(response.data.admin.name);
      } catch (error: any) {
        console.log(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        Welcome, {name}
      </Text>

      <Text
        style={{
          marginTop: 10,
          fontSize: 16,
        }}
      >
        Admin Dashboard
      </Text>
    </View>
  );
}