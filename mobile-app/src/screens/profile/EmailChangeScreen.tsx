import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { AxiosError } from "axios";
import { router } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import BackButton from "@/src/components/common/BackButton";
import Input from "@/src/components/common/Input";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { getCurrentUser, sendEmailChangeOtp } from "@/src/api/auth.api";

type ApiErrorResponse = {
  message?: string;
  errors?: {
    msg: string;
  }[];
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailChangeScreen = () => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getCurrentUser();
      if (!response.data) return;
      setCurrentEmail(response.data.email ?? "");
    } catch (err) {
      console.log("Error loading profile:", err);
    }
  };

  const getErrorMessage = (err: unknown) => {
    const axiosError = err as AxiosError<ApiErrorResponse>;
    const validationMessage = axiosError.response?.data?.errors?.[0]?.msg;

    if (axiosError.message === "Network Error" || axiosError.code === "ERR_NETWORK") {
      return "Network connection error. Please check your internet connection or server availability and try again.";
    }

    return (
      validationMessage ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Unable to send OTP. Please try again."
    );
  };

  const handleSendOtp = async () => {
    const trimmedNewEmail = newEmail.trim().toLowerCase();

    if (!trimmedNewEmail) {
      const msg = "New email is required.";
      setError(msg);
      Alert.alert("Check your email", msg);
      return;
    }

    if (!emailPattern.test(trimmedNewEmail)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      Alert.alert("Check your email", msg);
      return;
    }

    if (trimmedNewEmail === currentEmail.toLowerCase()) {
      const msg = "New email must be different from your current email.";
      setError(msg);
      Alert.alert("Check your email", msg);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await sendEmailChangeOtp({ email: trimmedNewEmail });

      if (response?.data?.otp) {
        Alert.alert(
          "Development OTP",
          `Email could not be sent from the local backend. Use OTP ${response.data.otp}.`
        );
      }

      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          email: trimmedNewEmail,
          type: "change-email",
        },
      });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      Alert.alert("OTP Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.title}>Change Email</Text>
            <View style={{ width: 40 }} />
          </View>

          <Text style={styles.description}>
            Enter your new email address. We'll send a verification OTP before
            updating your account.
          </Text>

          <Input
            label="Current Email"
            value={currentEmail}
            editable={false}
          />

          <Input
            label="New Email"
            placeholder="Enter new email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={newEmail}
            onChangeText={(text) => {
              setNewEmail(text);
              setError("");
            }}
          />

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Send OTP"
              loading={loading}
              disabled={loading}
              onPress={handleSendOtp}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default EmailChangeScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  description: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 28,
  },

  errorText: {
    color: Colors.error,
    fontFamily: Fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    textAlign: "center",
  },

  buttonContainer: {
    marginTop: 24,
  },
});