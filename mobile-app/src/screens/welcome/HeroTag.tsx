import { StyleSheet, Text, View } from "react-native";
import Fonts from "@/src/constants/fonts";

type Props = {
  title: string;
  backgroundColor: string;
};

export default function HeroTag({
  title,
  backgroundColor,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    fontSize: 14,
    borderRadius: 100,
  },

  text: {
    color: "#fff",
    fontFamily: Fonts.bold,
    textAlign:"center",
    fontSize: 15,
  },
});
