import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import BackButton from "@/src/components/common/BackButton";
import {
  forgotPassword,
  verifyResetOtp,
  sendEmailChangeOtp,
  verifyEmailChangeOtp,
  verifyRegistrationOtp,
  register,
  setAuthToken,
  ApiResponse,
  ForgotPasswordData,
} from "@/src/api/auth.api";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type OtpFlowType = "forgot-password" | "change-email" | "register";

export type VerifyOtpSearchParams = {
  email?: string;
  type?: OtpFlowType;
};

type ApiErrorResponse = {
  message?: string;
  errors?: {
    msg: string;
  }[];
};

const CELL_COUNT = 6;

const Page_Types: Record<OtpFlowType, string> = {
  "forgot-password": "Verify Code",
  "change-email": "Verify Email",
  register: "Verify Your Email",
};

export default function VerifyOtpScreen() {
  const { email, type } = useLocalSearchParams<VerifyOtpSearchParams>();

  const emailValue = Array.isArray(email) ? email[0] : email;
  const rawType = Array.isArray(type) ? type[0] : type;
  const flowType: OtpFlowType =
    rawType === "register"
      ? "register"
      : rawType === "change-email"
        ? "change-email"
        : "forgot-password";

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

  const resendOtpByFlow = async (): Promise<
    ApiResponse<ForgotPasswordData>
  > => {
    if (!emailValue) throw new Error("Missing email address.");

    switch (flowType) {
      case "register":
        throw new Error(
          "Please register again to receive a new verification code.",
        );

      case "change-email":
        return await sendEmailChangeOtp({
          email: emailValue,
        });

      case "forgot-password":
      default:
        return await forgotPassword({
          email: emailValue,
        });
    }
  };

  const verifyOtpByFlow = async () => {
    if (!emailValue) throw new Error("Missing email address.");

    switch (flowType) {
      case "register":
        return await verifyRegistrationOtp({
          email: emailValue,
          otp: value,
        });

      case "change-email":
        return await verifyEmailChangeOtp({
          email: emailValue,
          otp: value,
        });

      case "forgot-password":
      default:
        return await verifyResetOtp({
          email: emailValue,
          otp: value,
        });
    }
  };

  const handleSuccessNavigation = async (response: any) => {
    if (flowType === "register") {
      const { accessToken, user } = response.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("authUser", JSON.stringify(user));

      setAuthToken(accessToken);

      router.replace("/complete-profile");

      return;
    }
    if (flowType === "change-email") {
      Alert.alert(
        "Email Verified",
        response?.message ||
          "Your email address has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/complete-profile");
              }
            },
          },
        ],
      );
    } else {
      const resetToken = response?.data?.resetToken;

      if (!resetToken) {
        throw new Error(response?.message || "OTP verification failed.");
      }

      router.push({
        pathname: "/(auth)/reset-password",
        params: {
          resetToken,
        },
      });
    }
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

      const response = await verifyOtpByFlow();
      await handleSuccessNavigation(response);
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

      const response = await resendOtpByFlow();

      if (response?.data?.otp) {
        Alert.alert(
          "Development OTP",
          `Email could not be sent from the local backend. Use OTP ${response.data.otp}.`,
        );
      } else {
        Alert.alert(
          "OTP Sent",
          "A new verification code has been sent to your email address.",
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

  const screenTitle = Page_Types[flowType] || "Verify Code";

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      <View style={styles.container}>
        <BackButton />

        <View style={styles.content}>
          <Text style={styles.heading}>{screenTitle}</Text>

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
