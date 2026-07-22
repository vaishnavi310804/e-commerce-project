import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { AxiosError } from "axios";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import Input from "@/src/components/common/Input";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import { register, setAuthToken } from "@/src/api/auth.api";

type ApiErrorResponse = {
  message?: string;
  errors?: {
    msg: string;
  }[];
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getValidationMessage = () => {
    if (!fullName.trim()) return "Full name is required.";
    if (!email.trim()) return "Email is required.";
    if (!emailPattern.test(email.trim())) return "Please enter a valid email.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!agree) return "Please agree to the terms and conditions.";
    return "";
  };

  const getErrorMessage = (err: unknown) => {
    const axiosError = err as AxiosError<ApiErrorResponse>;
    const validationMessage = axiosError.response?.data?.errors?.[0]?.msg;

    return (
      validationMessage ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Unable to create your account. Please try again."
    );
  };

  const handleRegister = async () => {
    const validationMessage = getValidationMessage();

    if (validationMessage) {
      setError(validationMessage);
      Alert.alert("Check your details", validationMessage);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (!response.data) {
        throw new Error(response.message || "Registration failed.");
      }

      const { accessToken, refreshToken, user } = response.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      await SecureStore.setItemAsync("authUser", JSON.stringify(user));

      setAuthToken(accessToken);
      router.replace("/complete-profile");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      Alert.alert("Registration failed", message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    if (error) setError("");
  };

  return (
    <ScreenWrapper
      safeArea={false}
      statusBarStyle="light"
      backgroundColor="#F8F7FF"
    >
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
            <ImageBackground
              source={require("../../../assets/images/bgimage.png")}
              style={styles.header}
              imageStyle={styles.headerImage}
            >
              <LinearGradient
                colors={["rgba(108,78,255,0.88)", "rgba(124,92,255,0.92)"]}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.headerContent}>
                <Image
                  source={require("../../../assets/images/logo2.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />

                <Text style={styles.heading}>Create Account</Text>

                <Text style={styles.subHeading}>
                  Sign up to start shopping
                </Text>
              </View>
            </ImageBackground>

            <View style={styles.card}>
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={require("../../../assets/images/google.logo.png")}
                    style={styles.googleIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-apple" size={26} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR CONTINUE WITH</Text>
                <View style={styles.line} />
              </View>

              <Input
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  clearError();
                }}
              />

              <Input
                label="Email"
                placeholder="example@gmail.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError();
                }}
                keyboardType="email-address"
              />

              <Input
                label="Password"
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearError();
                }}
                secureTextEntry
              />

              {password.length > 0 && password.length < 8 && (
                <Text style={styles.helperText}>
                  Password must be at least 8 characters.
                </Text>
              )}

              <Input
                label="Confirm Password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  clearError();
                }}
                secureTextEntry
              />

              <View style={styles.checkboxRow}>
                <TouchableOpacity
                  style={[styles.checkbox, agree && styles.checkboxActive]}
                  onPress={() => {
                    setAgree(!agree);
                    clearError();
                  }}
                >
                  {agree && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </TouchableOpacity>

                <Text style={styles.checkboxText}>
                  I agree to{" "}
                  <Text style={styles.linkText}>Terms & Conditions</Text>
                </Text>
              </View>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <PrimaryButton
                title="Create Account"
                loading={loading}
                disabled={loading}
                onPress={handleRegister}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>

                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.signupText}> Sign In</Text>
                </TouchableOpacity>
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
    backgroundColor: "#F8F7FF",
  },

  scrollContainer: {
    flexGrow: 1,
  },

  header: {
    height: 320,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },

  headerImage: {
    resizeMode: "cover",
  },

  headerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 120,
    height: 90,
  },

  heading: {
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
    fontSize: 28,
  },

  subHeading: {
    fontFamily: Fonts.regular,
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
  },

  card: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginTop: -60,
    marginBottom: 0,
    borderRadius: 36,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 8,
  },

  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginBottom: 24,
  },

  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 8,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  orText: {
    marginHorizontal: 12,
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: "#9CA3AF",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },

  footerText: {
    fontFamily: Fonts.regular,
    color: "#6B7280",
    fontSize: 14,
  },

  signupText: {
    fontFamily: Fonts.bold,
    color: Colors.primary,
    fontSize: 14,
  },

  googleIcon: {
    width: 45,
    height: 45,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 6,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  checkboxText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "#4B5563",
  },

  linkText: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },

  errorText: {
    color: Colors.error,
    fontFamily: Fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
    textAlign: "center",
  },

  helperText: {
    color: Colors.error,
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 14,
  },
});
