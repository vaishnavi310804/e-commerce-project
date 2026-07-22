import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import BackButton from "@/src/components/common/BackButton";
import Avatar from "@/src/components/profile/Avatar";
import PhoneInput from "@/src/components/profile/PhoneInput";
import GenderDropdown from "@/src/components/profile/GenderDropdown";
import Input from "@/src/components/common/Input";
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

const handleCompleteProfile = async () => {
  try {
    const formData = new FormData();

    formData.append("phoneNumber", phone);
    formData.append("gender", gender);

    if (image) {
      formData.append("profileImage", {
        uri: image,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    }

    await updateProfile(formData);

    router.replace("/(tabs)/home");
  } catch (error) {
    console.error("Profile update failed:", error);
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

          <Text style={styles.title}>
            Complete Your Profile
          </Text>

          <Text style={styles.subtitle}>
            Don't worry, only you can see your
            {"\n"}
            personal information.
          </Text>

          <Avatar
            image={image}
            onChange={setImage}
          />

          {/* <Input
            label="Name"
            placeholder="Enter Your Name"
            value={name}
            onChangeText={setName}
          /> */}

          <PhoneInput
            value={phone}
            onChangeText={setPhone}
          />

          <GenderDropdown
            value={gender}
            onSelect={setGender}
          />

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Complete Profile"
              onPress={handleCompleteProfile}
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