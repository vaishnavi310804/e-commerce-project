import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { router } from "expo-router";

type Props = {
  value: string;
  onChangeEmail?: () => void;
};

const EmailInput = ({ value, onChangeEmail }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          editable={false}
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor="#A0A0A0"
        />

        <Pressable onPress={onChangeEmail}>
          <Text style={styles.changeText}>Change</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EmailInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: "#8A8A8A",
  },

  changeText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
});