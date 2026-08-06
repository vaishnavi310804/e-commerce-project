import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import PermissionScreen from "@/src/components/onboarding/PermissionScreen";
import Colors from "@/src/constants/colors";
import { requestNotificationPermission } from "@/src/services/notification.service";
import { updateFcmToken } from "@/src/api/notification.api";

const NotificationPermissionScreen = () => {
  const [loading, setLoading] = useState(false);

const handleAllowNotification = async () => {
  try {
    setLoading(true);

    const token = await requestNotificationPermission();

    if (!token) {
      Alert.alert("Unable to enable notifications.");
      return;
    }

    const response = await updateFcmToken(token);

    if (!response.success) {
      Alert.alert("Failed to save FCM Token");
      return;
    }

    router.replace("/(tabs)");
  } catch (error: any) {
    console.log(error);

    Alert.alert(
      "Error",
      error?.response?.data?.message ||
        error?.message ||
        "Unable to enable notifications."
    );
  } finally {
    setLoading(false);
  }
};

  const handleMaybeLater = () => {
    router.replace("/(tabs)");
  };

  return (
    <ScreenWrapper>
      <PermissionScreen
        icon={
          <Ionicons
            name="notifications"
            size={54}
            color={Colors.primary}
          />
        }
        title="Enable Notification Access"
        subtitle="Enable notifications to receive real-time updates about your orders, offers, and exclusive deals."
        primaryButtonTitle={
          loading ? "Please wait..." : "Allow Notification"
        }
        secondaryButtonTitle="Maybe Later"
        onPrimaryPress={handleAllowNotification}
        onSecondaryPress={handleMaybeLater}
      />
    </ScreenWrapper>
  );
};

export default NotificationPermissionScreen;