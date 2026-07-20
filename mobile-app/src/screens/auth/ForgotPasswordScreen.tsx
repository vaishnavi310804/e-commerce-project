import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AxiosError } from "axios";
import { router } from "expo-router";
import BackButton from "@/src/components/common/BackButton";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import Input from "@/src/components/common/Input";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import { forgotPassword } from "@/src/api/auth.api";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type ApiErrorResponse = {
  message?: string;
  errors?: {
    msg: string;
  }[];
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (err: unknown) => {
    const axiosError = err as AxiosError<ApiErrorResponse>;
    const validationMessage = axiosError.response?.data?.errors?.[0]?.msg;

    return (
      validationMessage ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Unable to send OTP. Please try again."
    );
  };

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      const message = "Email is required.";
      setError(message);
      Alert.alert("Check your email", message);
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      const message = "Please enter a valid email.";
      setError(message);
      Alert.alert("Check your email", message);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await forgotPassword({ email: trimmedEmail });

      if (response.data?.otp) {
        Alert.alert(
          "Development OTP",
          `Email could not be sent from the local backend. Use OTP ${response.data.otp}.`
        );
      }

      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          email: trimmedEmail,
        },
      });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      Alert.alert("OTP failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      <View style={styles.container}>
        <BackButton />

        <View style={styles.content}>
          <Text style={styles.heading}>Forgot Password?</Text>

          <Text style={styles.subHeading}>
            Do not worry! Enter your email address and we will send you a
            verification code.
          </Text>

          <Input
            label="Email"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            keyboardType="email-address"
          />

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <PrimaryButton
            title="Send OTP"
            loading={loading}
            disabled={loading}
            onPress={handleSendOtp}
          />
        </View>
      </View>
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
    marginTop: 60,
  },

  heading: {
    fontFamily: Fonts.bold,
    fontSize: 34,
    color: "#111827",
    textAlign: "center",
  },

  subHeading: {
    marginTop: 14,
    textAlign: "center",
    fontFamily: Fonts.regular,
    color: "#6B7280",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },

  errorText: {
    color: Colors.error,
    fontFamily: Fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
    textAlign: "center",
  },
});
