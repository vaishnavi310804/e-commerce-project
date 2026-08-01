import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import PermissionScreen from "@/src/components/onboarding/PermissionScreen";
import Colors from "@/src/constants/colors";

const LocationPermissionScreen = () => {
  const handleAllowLocation = () => {
    // We'll request location permission later
    router.push("/notification-permission");
  };

  const handleManualLocation = () => {
    // Navigate to address selection screen later
    router.push("/notification-permission");
  };

  return (
    <ScreenWrapper>
      <PermissionScreen
        icon={<Ionicons name="location" size={54} color={Colors.primary} />}
        title="What is Your Location?"
        subtitle="Turn on location services to get better delivery estimates and faster delivery."
        primaryButtonTitle="Allow Location Access"
        secondaryButtonTitle="Enter Location Manually"
        onPrimaryPress={handleAllowLocation}
        onSecondaryPress={handleManualLocation}
      />
    </ScreenWrapper>
  );
};

export default LocationPermissionScreen;
