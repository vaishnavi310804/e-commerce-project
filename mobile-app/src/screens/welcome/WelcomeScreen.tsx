import { StyleSheet, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import Spacing from "@/src/constants/spacing";
import HeroSection from "@/src/screens/welcome/HeroSection";

export default function WelcomeScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.hero}>
          <HeroSection />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Shop Smarter with an{"\n"}
            <Text style={styles.highlight}>Experience Built for You</Text>
          </Text>

          <Text style={styles.subtitle}>
            Discover thousands of products, exclusive deals, and a seamless
            shopping experience all in one place.
          </Text>

          <PrimaryButton
            title="Let's Get Started"
            onPress={() => router.push("/(auth)/login")}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>

            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.signIn}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    backgroundColor: "#F8F7FF",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholder: {
    width: 280,
    height: 280,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
  },

  content: {
    gap: 20,
  },

  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 30,
  },

  highlight: {
    color: Colors.primary,
  },

  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    alignSelf: "center",
    lineHeight: 18,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },

  footerText: {
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },

  signIn: {
    fontFamily: Fonts.semibold,
    color: Colors.primary,
  },
});
