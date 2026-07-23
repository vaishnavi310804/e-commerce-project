import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
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

      const { accessToken, refreshToken, user } = response.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      await SecureStore.setItemAsync("authUser", JSON.stringify(user));

      setAuthToken(accessToken);
      router.replace("/(tabs)");
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

            <Text style={styles.heading}>Welcome Back!</Text>

            <Text style={styles.subHeading}>Sign in to continue shopping</Text>
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

            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.signupText}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
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
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginTop: -60,
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
});
