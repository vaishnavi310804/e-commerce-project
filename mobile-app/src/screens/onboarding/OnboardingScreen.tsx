import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import PageDots from "@/src/components/onboarding/PageDots";
import NavigationButton from "@/src/components/onboarding/NavigationButton";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { onboardingData } from "@/src/constants/onboarding";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace("/welcome");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    router.replace("/welcome");
  };

  return (
    <ScreenWrapper
      safeArea={false}
      backgroundColor={Colors.primary}
      statusBarStyle="light"
    >
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.page, { width }]}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <View style={styles.bottomCard}>
              <Text style={styles.title}>
                {item.title}
                {"\n"}
                <Text style={styles.highlight}>
                  {item.highlight}
                </Text>
              </Text>

              <Text style={styles.description}>
                {item.description}
              </Text>

              <View style={styles.footer}>
                <PageDots
                  total={onboardingData.length}
                  activeIndex={currentIndex}
                />

                <NavigationButton
                  currentIndex={currentIndex}
                  total={onboardingData.length}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </View>
            </View>
          </View>
        )}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  skipButton: {
    alignSelf: "flex-end",
    marginTop: 60,
    marginRight: 24,
  },

  skipText: {
    color: "#FFFFFF",
    fontFamily: Fonts.medium,
    fontSize: 16,
  },

  imageContainer: {
    height: height * 0.48,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: width * 0.82,
    height: "100%",
  },

  bottomCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 28,
    paddingTop: 40,
  },

  title: {
    fontSize: 30,
    textAlign: "center",
    color: "#1E1E1E",
    fontFamily: Fonts.bold,
    lineHeight: 38,
  },

  highlight: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },

  description: {
    marginTop: 18,
    textAlign: "center",
    color: "#7A7A7A",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.regular,
    paddingHorizontal: 8,
  },

  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 35,
  },
});