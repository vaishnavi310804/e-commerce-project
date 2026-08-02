import React from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import PermissionScreen from "@/src/components/onboarding/PermissionScreen";
import Colors from "@/src/constants/colors";

const LocationPermissionScreen = () => {
  const handleAllowLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required for accurate delivery estimates."
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log("Latitude:", location.coords.latitude);
      console.log("Longitude:", location.coords.longitude);

      router.push("/notification-permission");
    } catch (error) {
      console.log("Location Error:", error);

      Alert.alert(
        "Error",
        "Unable to fetch your current location."
      );
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