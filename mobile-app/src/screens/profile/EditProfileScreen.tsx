import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform, Alert} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import BackButton from "@/src/components/common/BackButton";
import Avatar from "@/src/components/profile/Avatar";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import { updateProfile, getCurrentUser, AuthUser } from "@/src/api/auth.api";
import GenderDropdown from "@/src/components/profile/GenderDropdown";
import PhoneInput from "@/src/components/profile/PhoneInput";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { router } from "expo-router";
import Input from "@/src/components/common/Input";
import EmailInput from "@/src/components/profile/EmailInput";

const EditProfileScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Female");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getCurrentUser();
            if (!response.data) return;
      const user = response.data;

      setName(user.fullName ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phoneNumber ?? "");
      setGender(user.gender ?? "Female");
      setImage(user.profileImage ?? null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("fullName", name);
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
      Alert.alert("Success", "Profile updated successfully.");
      router.back();
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
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.title}>Your Profile</Text>

            <View style={{ width: 40 }} />
          </View>

          <View style={styles.avatarContainer}>
            <Avatar image={image} onChange={setImage} />
          </View>

          <Input
            label="Name"
            placeholder="Enter Your Name"
            value={name}
            onChangeText={setName}
          />

          <EmailInput
            value={email}
           onChangeEmail={() => router.push("/change-email")}
          />
          <PhoneInput value={phone} onChangeText={setPhone} />

          <GenderDropdown value={gender} onSelect={setGender} />

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Update Profile"
              onPress={handleEditProfile}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};
export default EditProfileScreen;

const styles = StyleSheet.create({
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

  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  content: {
  paddingHorizontal: 24,
  paddingTop: 12,
  paddingBottom: 40,
},

buttonContainer: {
  marginTop: 30,
},
});
