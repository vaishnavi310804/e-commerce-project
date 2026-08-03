import React from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import PermissionScreen from "@/src/components/onboarding/PermissionScreen";

import Colors from "@/src/constants/colors";

import { getCurrentLocation } from "@/src/services/location.service";
import { updateCurrentLocation } from "@/src/api/auth.api";

const LocationPermissionScreen = () => {
  const handleAllowLocation = async () => {
    try {
      const location = await getCurrentLocation();

      if (!location) {
        Alert.alert(
          "Permission Denied",
          "Location permission was denied or your current location could not be fetched."
        );

        router.push("/notification-permission");
        return;
      }

      await updateCurrentLocation(location);

      router.push("/notification-permission");
    } catch (error) {
      console.log("Location Error:", error);

      Alert.alert(
        "Location Error",
        "Unable to fetch your current location."
      );

      router.push("/notification-permission");
    }
  };

  const handleManualLocation = () => {
    router.push("/notification-permission");
  };

  return (
    <ScreenWrapper>
      <PermissionScreen
        icon={
          <Ionicons
            name="location"
            size={54}
            color={Colors.primary}
          />
        }
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