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
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
    },

    subtitleText: {
        fontSize: 14,
        color: "#64748b",
        marginTop: 4,
    }
});

export default function MenuItem(props: { title: string, textColor?: string, subtitle?: string[], onPress?: () => void }) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={props.onPress}>
            <Text style={[styles.menuText, { color: props.textColor }]}>{props.title}</Text>
            {props.subtitle && props.subtitle.map((sub, index) => (
                <Text style={styles.subtitleText} key={index}>
                    {sub}
                </Text>
            ))}
        </TouchableOpacity>
    );
}