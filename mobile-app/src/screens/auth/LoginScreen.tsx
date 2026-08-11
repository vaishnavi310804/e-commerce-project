import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import Input from "@/src/components/common/Input";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import { login, setAuthToken } from "@/src/api/auth.api";

type ApiErrorResponse = {
  message?: string;
  errors?: {
    msg: string;
  }[];
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isDisabled = !email.trim() || !password.trim() || loading;
  const getErrorMessage = (err: unknown) => {
    const axiosError = err as AxiosError<ApiErrorResponse>;
    const validationMessage = axiosError.response?.data?.errors?.[0]?.msg;

    return (
      validationMessage ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Unable to sign in. Please try again."
    );
  };

  const handleLogin = async () => {
    if (isDisabled) return;

    try {
      setError("");
      setLoading(true);

      const response = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!response.data) {
        throw new Error(response.message || "Login failed.");
      }

      const { accessToken, user } = response.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("authUser", JSON.stringify(user));

      setAuthToken(accessToken);

      // Check whether Android notification permission is already granted
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const hasNotificationPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (hasNotificationPermission) {
          // Permission already granted → skip permission screen
          router.replace("/(tabs)");
          return;
        }
      }

      // Permission not granted show notification permission screen
      router.replace("/notification-permission");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      Alert.alert("Sign in failed", message);
    } finally {
      setLoading(false);
    }
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
        keyboardVerticalOffset={20}
      >
        <ScrollView>
          <View style={styles.container}>
            <ImageBackground
              source={require("../../../assets/images/bgimage.png")}
              style={styles.header}
              imageStyle={styles.headerImage}
            >
              <View style={styles.bgColor} />
              <View style={styles.headerContent}>
                <Image
                  source={require("../../../assets/images/logo2.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />

                <Text style={styles.heading}>Welcome Back!</Text>

                <Text style={styles.subHeading}>
                  Sign in to continue shopping
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
                label="Email"
                placeholder="example@gmail.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                keyboardType="email-address"
              />

              <Input
                label="Password"
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.forgotContainer}
                onPress={() => router.push("/(auth)/forgot_password")}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <PrimaryButton
                title="Sign In"
                loading={loading}
                disabled={isDisabled}
                onPress={handleLogin}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Do not have an account?</Text>

                <TouchableOpacity
                  onPress={() => router.push("/(auth)/register")}
                >
                  <Text style={styles.signupText}> Sign Up</Text>
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
    backgroundColor: "#F6F6F6",
    flexGrow: 1,
    paddingBottom: 180,
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
  bgColor: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#6547C9",
    opacity: 0.85,
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
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginTop: -50,
    borderRadius: 36,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
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
    backgroundColor: "#797979",
  },
  orText: {
    marginHorizontal: 12,
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: "#9CA3AF",
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 4,
    marginBottom: 20,
  },

  forgotText: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },

  errorText: {
    color: Colors.error,
    fontFamily: Fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
    textAlign: "center",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },

  footerText: {
    fontFamily: Fonts.regular,
    color: Colors.gray,
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
});
