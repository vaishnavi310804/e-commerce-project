import React from "react";
import { StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { Href } from "expo-router";

type ProfileMenuProps = {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
};

const ProfileMenu = ({
  title,
  icon,
  onPress,
}: ProfileMenuProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          {icon}
        </View>

        <Text style={styles.title}>
          {title}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={Colors.primary}
      />
    </TouchableOpacity>
  );
};

export default ProfileMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 14,

    borderRadius: 16,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#F1F1F1",
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F7F4FF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  title: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
});