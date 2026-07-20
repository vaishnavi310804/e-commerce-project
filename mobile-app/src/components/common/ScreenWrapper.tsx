import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import Colors from "@/src/constants/colors";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  statusBarStyle?: "light" | "dark" | "auto";
  safeArea?: boolean;
  keyboardAvoiding?: boolean;
}

const ScreenWrapper = ({
  children,
  style,
  backgroundColor = Colors.background,
  statusBarStyle = "dark",
  safeArea = true,
  keyboardAvoiding = false,
}: ScreenWrapperProps) => {
  const Container = safeArea ? SafeAreaView : View;

  const content = (
    <Container
      style={[
        styles.container,
        { backgroundColor },
        style,
      ]}
    >
      <StatusBar style={statusBarStyle} />
      {children}
    </Container>
  );

  if (!keyboardAvoiding) {
    return content;
  }

  return (
    <KeyboardAvoidingView
      style={styles.key}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  key: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});