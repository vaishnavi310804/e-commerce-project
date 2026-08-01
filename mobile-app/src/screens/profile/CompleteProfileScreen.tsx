import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import BackButton from "@/src/components/common/BackButton";
import Avatar from "@/src/components/profile/Avatar";
import PhoneInput from "@/src/components/profile/PhoneInput";
import GenderDropdown from "@/src/components/profile/GenderDropdown";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { updateProfile } from "@/src/api/auth.api";

export default function CompleteProfileScreen() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCompleteProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (name.trim()) {
        formData.append("fullName", name.trim());
      }
      if (phone.trim()) {
        formData.append("phoneNumber", phone.trim());
      }
      if (gender) {
        formData.append("gender", gender);
      }

      if (image) {
        if (
          image.startsWith("file://") ||
          image.startsWith("content://") ||
          image.startsWith("ph://")
        ) {
          formData.append("profileImage", {
            uri: image,
            name: "profile.jpg",
            type: "image/jpeg",
          } as any);
        } else {
          formData.append("profileImage", image);
        }
      }

      await updateProfile(formData);
      router.replace("/location-permission");
      
    } catch (error: any) {
      console.error("Profile update failed:", error?.response?.data || error);
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data?.message ||
        "Failed to complete profile. Please check your inputs.";
      Alert.alert("Update Failed", errorMessage);
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
          <BackButton />
          <Text style={styles.title}>Complete Your Profile</Text>

          <Text style={styles.subtitle}>
            Don't worry, only you can see your
            {"\n"}
            personal information.
          </Text>

          <Avatar image={image} onChange={setImage} />

          <PhoneInput value={phone} onChangeText={setPhone} />

          <GenderDropdown value={gender} onSelect={setGender} />

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={loading ? "Updating..." : "Complete Profile"}
              onPress={handleCompleteProfile}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },

  title: {
    marginTop: 20,
    fontSize: 28,
    textAlign: "center",
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 24,
    fontFamily: Fonts.regular,
  },

  buttonContainer: {
    marginTop: 20,
  },
});