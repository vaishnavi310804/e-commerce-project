import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform} from "react-native";
import React,{useState, useEffect} from "react";
import {getCurrentUser} from "@/src/api/auth.api"
import { router } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import BackButton from "@/src/components/common/BackButton";
import Input from "@/src/components/common/Input";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";


const EmailChangeScreen = () => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

   const loadProfile = async () => {
    try {
      const response = await getCurrentUser();

      if (!response.data) return;

      setCurrentEmail(response.data.email ?? "");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendOtp = async () => {
    if (!newEmail.trim()) return;

    router.push({
      pathname: "/verify-otp",
      params: {
        email: newEmail,
        type: "change-email",
      },
    });
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
            onChangeText={setNewEmail}
          />

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Send OTP"
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

  buttonContainer: {
    marginTop: 24,
  },
});