import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../services/api";

export default function Home() {
  const [role, setRole] = useState<"student" | "faculty" | "admin"> ("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      let requestBody = {};

      switch (role) {
        case "student":
          requestBody = {scholarNumber: userId, password};
          break;

        case "faculty":
          requestBody = { employeeNumber: userId, password};
          break;

        case "admin":
          requestBody = {adminNumber: userId, password};
          break;
      }

      console.log("Request Body:", requestBody);


      // ####### WILL BE REMOVED LATER, THIS IS JUST FOR TESTING PURPOSES #######

      // const response = await axios.post(
      //   `http://localhost:3000/auth/login/${role}`,
      //   requestBody,
      //   {
      //     withCredentials: true,
      //   }
      // );

      // ####### WILL BE REMOVED LATER, THIS IS JUST FOR TESTING PURPOSES #######


      const response = await api.post(`/auth/login/${role}`,requestBody);

      console.log(response.data);

      if (response.data.success) {
        switch (role) {
          case "student":
            router.push("/student-home");
            break;

          case "faculty":
            router.push("/faculty-home");
            break;

          case "admin":
            router.push("/admin-home");
            break;
        }
      }
    } catch (error: any) {
      console.log("Login Failed");

      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };

  const getPlaceholder = () => {
    switch (role) {
      case "student":
        return "Scholar Number";

      case "faculty":
        return "Employee Number";

      case "admin":
        return "Admin Number";

      default:
        return "User ID";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Role Selector */}

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "student" && styles.activeRoleButton,
          ]}
          onPress={() => {
            setRole("student");
            setUserId("");
          }}
        >
          <Text
            style={[
              styles.roleButtonText,
              role === "student" && styles.activeRoleButtonText,
            ]}
          >
            Student
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "faculty" && styles.activeRoleButton,
          ]}
          onPress={() => {
            setRole("faculty");
            setUserId("");
          }}
        >
          <Text
            style={[
              styles.roleButtonText,
              role === "faculty" && styles.activeRoleButtonText,
            ]}
          >
            Faculty
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "admin" && styles.activeRoleButton,
          ]}
          onPress={() => {
            setRole("admin");
            setUserId("");
          }}
        >
          <Text
            style={[
              styles.roleButtonText,
              role === "admin" && styles.activeRoleButtonText,
            ]}
          >
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic ID Field */}

      <TextInput
        style={styles.input}
        placeholder={getPlaceholder()}
        value={userId}
        onChangeText={setUserId}
        autoCapitalize="characters"
      />

      {/* Password */}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Continue as{" "}
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f8fafc",
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#0f172a",
  },

  roleContainer: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },

  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  activeRoleButton: {
    backgroundColor: "#39367B",
  },

  roleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },

  activeRoleButtonText: {
    color: "#ffffff",
  },

  input: {
    backgroundColor: "#ffffff",
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
    marginTop: 8,
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});