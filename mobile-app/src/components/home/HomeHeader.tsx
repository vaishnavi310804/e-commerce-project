import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type HomeHeaderProps = {
  name?: string;
  image?: string;
  locationTitle?: string;
  address?: string;
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
};

const HomeHeader = ({
  name,
  image,
  locationTitle,
  address,
  onLocationPress,
  onNotificationPress,
}: HomeHeaderProps) => {
  const imageUri =
    typeof image === "string" ? image.trim() : (image as any)?.url;
  const hasValidImage = Boolean(imageUri && imageUri.length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          <Image
            source={
              hasValidImage
                ? { uri: imageUri }
                : require("@/assets/images/avatar-placeholder.png")
            }
            style={styles.avatar}
          />

          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{name || "Guest"}</Text>
          </View>
        </View>

        <Pressable
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.primary}
          />

          <View style={styles.badge} />
        </Pressable>
      </View>

      <Pressable style={styles.locationRow} onPress={onLocationPress}>
        <Ionicons
          name="location-outline"
          size={20}
          color={Colors.white}
          style={{ marginTop: 2 }}
        />

        <View style={styles.locationContent}>
          <Text style={styles.locationTitle}>
            {locationTitle || "Deliver to"}
          </Text>

          <Text style={styles.locationText} numberOfLines={1}>
            {address || "Set your location"}
          </Text>
        </View>

        <Ionicons name="chevron-down" size={16} color={Colors.white} />
      </Pressable>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 65,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 14,
    backgroundColor: "#FFFFFF",
  },

  header: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },

  headerImage: {
    resizeMode: "cover",
  },

  greeting: {
    color: "#E8DFFF",
    fontSize: 14,
    fontFamily: Fonts.regular,
  },

  name: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: Fonts.bold,
    marginTop: 1,
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    position: "absolute",
    top: 10,
    right: 10,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingVertical: 6,
  },

  locationContent: {
    marginHorizontal: 8,
    flex: 1,
  },

  locationTitle: {
    color: "#E8DFFF",
    fontSize: 12,
    fontFamily: Fonts.regular,
  },

  locationText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: Fonts.bold,
    // marginTop: 1,
  },
});
