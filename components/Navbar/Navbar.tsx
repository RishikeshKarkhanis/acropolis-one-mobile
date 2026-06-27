import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
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
  }
});

export default function Navbar(props: { user: any }) {
    return (
        <View style={styles.navbar}>
            <Text style={styles.welcomeText}>
                Welcome, {props.user?.name}
            </Text>
        </View>)
}