import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type HomeHeaderProps = {
  name?: string;
  image?: string;
  address?: string;
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
};

const HomeHeader = ({
  name,
  address,
  image,
  onLocationPress,
  onNotificationPress,
}: HomeHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          <Image
            source={
              image
                ? { uri: image }
                : require("@/assets/images/avatar-placeholder.png")
            }
            style={styles.avatar}
          />

          <View>
            <Text style={styles.greeting}>Hello 👋</Text>
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
        <Ionicons name="location-outline" size={18} color={Colors.white} />

        <Text style={styles.locationText}>
          {address || "Select Delivery Location"}
        </Text>

        <Ionicons
          name="chevron-down"
          size={16}
          color={Colors.white}
          style={{ marginLeft: 4 }}
        />
      </Pressable>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 28,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    backgroundColor: "#fff",
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
    marginTop: 2,
  },

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    position: "absolute",
    top: 10,
    right: 10,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    alignSelf: "flex-start",
    paddingVertical: 6,
  },

  locationText: {
    color: Colors.white,
    marginLeft: 6,
    fontSize: 15,
    fontFamily: Fonts.medium,
  },
});
