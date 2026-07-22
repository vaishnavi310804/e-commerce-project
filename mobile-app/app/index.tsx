import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import Fonts from "@/src/constants/fonts";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import Colors from "@/src/constants/colors";

const Index = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper safeArea={false}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>ShopEase</Text>
      </View>
    </ScreenWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  logo: {
    width: 110,
    height: 150,
  },

  title: {
    marginTop: 18,
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
    letterSpacing: 0.3,
  },
});