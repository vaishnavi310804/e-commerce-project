import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from "react-native-confirmation-code-field";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import BackButton from "@/src/components/common/BackButton";
import { forgotPassword, verifyResetOtp } from "@/src/api/auth.api";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type ApiErrorResponse = {
  message?: string;
  errors?: {
    msg: string;
  }[];
};

const CELL_COUNT = 6;

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const emailValue = Array.isArray(email) ? email[0] : email;
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const getErrorMessage = (err: unknown) => {
    const axiosError = err as AxiosError<ApiErrorResponse>;
    const validationMessage = axiosError.response?.data?.errors?.[0]?.msg;

    return (
      validationMessage ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Unable to verify OTP. Please try again."
    );
  };

  const handleVerifyOtp = async () => {
    if (!emailValue) {
      const message = "Please request an OTP again.";
      setError(message);
      Alert.alert("Missing email", message);
      return;
    }

    if (value.length !== CELL_COUNT) {
      const message = "Please enter the 6-digit OTP.";
      setError(message);
      Alert.alert("Check OTP", message);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await verifyResetOtp({
        email: emailValue,
        otp: value,
      });

      const resetToken = response.data?.resetToken;

      if (!resetToken) {
        throw new Error(response.message || "OTP verification failed.");
      }

      router.push({
        pathname: "/(auth)/reset-password",
        params: {
          resetToken,
        },
      });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      Alert.alert("OTP verification failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !emailValue) return;

    try {
      setError("");
      setResending(true);

      const response = await forgotPassword({ email: emailValue });

      if (response.data?.otp) {
        Alert.alert(
          "Development OTP",
          `Email could not be sent from the local backend. Use OTP ${response.data.otp}.`
        );
      }

      setValue("");
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      Alert.alert("Resend failed", message);
    } finally {
      setResending(false);
    }
  };

  const ref = useBlurOnFulfill({
    value,
    cellCount: CELL_COUNT,
  });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      <View style={styles.container}>
        <BackButton />

        <View style={styles.content}>
          <Text style={styles.heading}>Verify Code</Text>

          <Text style={styles.subHeading}>
            Enter the verification code we sent to
          </Text>

          <Text style={styles.email}>{emailValue || "your email"}</Text>

          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={(text) => {
              setValue(text);
              setError("");
            }}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            rootStyle={styles.codeFieldRoot}
            renderCell={({ index, symbol, isFocused }) => (
              <View
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : "")}
                </Text>
              </View>
            )}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.timer}>
              00:{timer.toString().padStart(2, "0")}
            </Text>

            <Text style={styles.resendText}>Did not receive the code?</Text>

            <TouchableOpacity
              disabled={!canResend || resending}
              onPress={handleResend}
            >
              <Text
                style={[styles.resendLink, !canResend && styles.disabledLink]}
              >
                {resending ? "Sending..." : "Resend Code"}
              </Text>
            </TouchableOpacity>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <PrimaryButton
            title="Verify"
            loading={loading}
            disabled={loading}
            onPress={handleVerifyOtp}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    marginTop: 55,
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
  },

  email: {
    marginTop: 8,
    textAlign: "center",
    color: "#111827",
    fontFamily: Fonts.medium,
    fontSize: 16,
  },

  codeFieldRoot: {
    marginTop: 50,
    justifyContent: "space-between",
  },

  cell: {
    width: 48,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },

  focusCell: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  cellText: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: "#111827",
  },

  resendContainer: {
    alignItems: "center",
    marginTop: 45,
    marginBottom: 40,
  },

  timer: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
    fontSize: 22,
    marginBottom: 16,
  },

  resendText: {
    fontFamily: Fonts.regular,
    color: "#6B7280",
    fontSize: 15,
  },

  resendLink: {
    marginTop: 8,
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },

  disabledLink: {
    color: "#C4C4C4",
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
