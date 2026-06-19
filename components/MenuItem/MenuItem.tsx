import { StyleSheet, Text, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
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
    }
});

export default function MenuItem(props: { title: string, onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={props.onPress}>
            <Text style={styles.menuText}>{props.title}</Text>
        </TouchableOpacity>
    );
}