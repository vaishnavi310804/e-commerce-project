import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import SettingItem from "@/src/components/settings/SettingItem";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import { router } from "expo-router";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";


const settings = [
  {
    title: "Notification Settings",
    icon: "notifications-outline",
    onPress: () => {},
  },
  {
    title: "Security",
    icon: "shield-checkmark-outline",
    onPress: () => {},
  },
  {
    title: "Theme",
    icon: "sunny-outline",
    onPress: () => {},
  },
  {
    title: "Delete Account",
    icon: "trash-outline",
    onPress: () => {},
  },
]as const;

const SettingScreen = () => {
  return (
     <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={Colors.text}
            />
          </TouchableOpacity>

          <Text style={styles.title}>Settings</Text>

          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {settings.map((item) => (
            <SettingItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              onPress={item.onPress}
            />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  placeholder: {
    width: 40,
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});