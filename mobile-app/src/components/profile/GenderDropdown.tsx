import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  value: string;
  onSelect: (value: string) => void;
};

const genders = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
];

export default function GenderDropdown({
  value,
  onSelect,
}: Props) {
  const [visible, setVisible] = useState(false);

  const handleSelect = (gender: string) => {
    onSelect(gender);
    setVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>Gender</Text>

        <TouchableOpacity
          style={styles.input}
          activeOpacity={0.8}
          onPress={() => setVisible(true)}
        >
          <Text
            style={[
              styles.value,
              !value && styles.placeholder,
            ]}
          >
            {value || "Select Gender"}
          </Text>

          <Ionicons
            name="chevron-down"
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            {genders.map((gender) => (
              <TouchableOpacity
                key={gender}
                style={styles.option}
                onPress={() => handleSelect(gender)}
              >
                <Text style={styles.optionText}>
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },

  input: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 16,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  value: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: Fonts.regular,
  },

  placeholder: {
    color: "#9CA3AF",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
  },

  option: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  optionText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: Fonts.medium,
  },
});