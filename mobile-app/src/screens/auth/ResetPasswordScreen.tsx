import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import BackButton from "@/src/components/common/BackButton";
import Input from "@/src/components/common/Input";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import Fonts from "@/src/constants/fonts";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isDisabled =
    password.length < 6 ||
    confirmPassword.length < 6 ||
    password !== confirmPassword;

  const handleResetPassword = () => {
    // TODO:
    // Call Reset Password API

    router.replace("/(auth)/login");
  };

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.container}>
            <BackButton />

            <View style={styles.content}>
              <Text style={styles.heading}>New Password</Text>

              <Text style={styles.subHeading}>
                Your new password must be different{"\n"}
                from previously used passwords.
              </Text>

              <View style={styles.form}>
                <Input
                  label="Password"
                  placeholder="Enter new password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                <Input
                  label="Confirm Password"
                  placeholder="Confirm password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />

                <PrimaryButton
                  title="Create New Password"
                  disabled={isDisabled}
                  onPress={handleResetPassword}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  content: {
    flex: 1,
    marginTop: 55,
  },

  heading: {
    fontFamily: Fonts.bold,
    fontSize: 34,
    textAlign: "center",
    color: "#111827",
  },

  subHeading: {
    marginTop: 14,
    textAlign: "center",
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
  },

  form: {
    marginTop: 50,
    gap: 22,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
