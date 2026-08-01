import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import PrimaryButton from "../common/PrimaryButton";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type PermissionScreenProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  primaryButtonTitle: string;
  secondaryButtonTitle: string;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
};

const PermissionScreen = ({
  icon,
  title,
  subtitle,
  primaryButtonTitle,
  secondaryButtonTitle,
  onPrimaryPress,
  onSecondaryPress,
}: PermissionScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>{icon}</View>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton title={primaryButtonTitle} onPress={onPrimaryPress} />

        <TouchableOpacity onPress={onSecondaryPress}>
          <Text style={styles.secondaryButton}>{secondaryButtonTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginTop: 36,
    fontSize: 30,
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray,
    fontFamily: Fonts.regular,
    textAlign: "center",
    paddingHorizontal: 12,
  },

  footer: {
    marginBottom: 20,
  },

  secondaryButton: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 16,
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },
});
