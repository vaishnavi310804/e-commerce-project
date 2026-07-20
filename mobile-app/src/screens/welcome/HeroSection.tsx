import { StyleSheet, View } from "react-native";
import HeroGrid from "./HeroGrid";
import HeroTag from "@/src/screens/welcome/HeroTag";
import Colors from "@/src/constants/colors";

export default function HeroSection() {
  return (
    <View style={styles.container}>
      <HeroGrid />

      <View style={styles.modernTag}>
        <HeroTag
          title="#Modern"
          backgroundColor={Colors.primary}
        />
      </View>

      <View style={styles.secureTag}>
        <HeroTag
          title="#Secure"
          backgroundColor="#111827"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 450,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  modernTag: {
    position: "absolute",
    top: 70,
    right: 30,
  },

  secureTag: {
    position: "absolute",
    bottom: 40,
    left: 80,
  },
});
