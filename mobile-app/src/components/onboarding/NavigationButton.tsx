import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";

type Props = {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
};

export default function NavigationButtons({
  currentIndex,
  total,
  onNext,
  onPrevious,
}: Props) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <View style={styles.container}>
      {isFirst ? (
        <View style={styles.placeholder} />
      ) : (
        <TouchableOpacity
          style={styles.outlineButton}
          activeOpacity={0.8}
          onPress={onPrevious}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.filledButton}
        activeOpacity={0.8}
        onPress={onNext}
      >
        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  placeholder: {
    width: 54,
    height: 54,
  },

  outlineButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  filledButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
