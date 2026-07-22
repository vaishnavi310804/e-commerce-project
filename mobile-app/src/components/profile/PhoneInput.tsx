import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  countryCode?: string;
  onCountryPress?: () => void;
};

export default function PhoneInput({
  value,
  onChangeText,
  countryCode = "+91",
  onCountryPress,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone Number</Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.countryContainer}
          activeOpacity={0.8}
          onPress={onCountryPress}
        >
          <Text style={styles.countryCode}>{countryCode}</Text>

          <Ionicons
            name="chevron-down"
            size={16}
            color="#6B7280"
          />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          maxLength={10}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
  },

  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  countryCode: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: Fonts.medium,
    marginRight: 4,
  },

  separator: {
    width: 1,
    height: 22,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontFamily: Fonts.regular,
  },

});