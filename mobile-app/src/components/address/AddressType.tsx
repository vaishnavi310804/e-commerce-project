import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Fonts from "@/src/constants/fonts";
import Colors from "@/src/constants/colors";

const TYPES = ["Home", "Office", "Other"];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const AddressType = ({ value, onChange }: Props) => {
  return (
    <View style={styles.type}>
      {TYPES.map((type) => {
        const active = value === type;

        return (
          <TouchableOpacity
            key={type}
            onPress={() => onChange(type)}
            style={[styles.container, {backgroundColor: active ? Colors.primary : "#F3F4F6"}]}
          >
            <Text style={[styles.typeContainer, {color: active ? "#FFF" : Colors.text}]}>{type}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default AddressType;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
  },
  type: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  typeContainer: {
    fontFamily: Fonts.semibold,
  },
});
