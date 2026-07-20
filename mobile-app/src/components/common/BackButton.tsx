import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {
  onPress?: () => void;
};

export default function BackButton({
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress ?? (() => router.back())}
    >
      <Ionicons
        name="chevron-back"
        size={26}
        color="#111827"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },
});