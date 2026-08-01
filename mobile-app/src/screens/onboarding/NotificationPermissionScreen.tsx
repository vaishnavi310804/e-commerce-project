import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import PermissionScreen from "@/src/components/onboarding/PermissionScreen";
import Colors from "@/src/constants/colors";

const NotificationPermissionScreen = () => {
  const handleAllowNotification = () => {
    // We'll request notification permission later
    router.replace("/(tabs)");
  };

  const handleMaybeLater = () => {
    // Skip notifications for now
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
        primaryButtonTitle="Allow Notification"
        secondaryButtonTitle="Maybe Later"
        onPrimaryPress={handleAllowNotification}
        onSecondaryPress={handleMaybeLater}
      />
    </ScreenWrapper>
  );
};

export default NotificationPermissionScreen;