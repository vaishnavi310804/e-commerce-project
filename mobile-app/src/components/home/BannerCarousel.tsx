import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import BannerItem, {banners} from "./BannerItem";
import Colors from "@/src/constants/colors";
import SectionHeader from "@/src/components/home/SectionHeader";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const BannerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Special Offers"
        onSeeAll={() => router.push("/(tabs)")}
      />

      <Carousel
        width={width}
        height={160}
        data={banners}
        autoPlay
        autoPlayInterval={3000}
        loop
        pagingEnabled
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.bannerWrapper}>
            <BannerItem
              banner={item}
            />
          </View>
        )}
      />

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

export default BannerCarousel;

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
  },

  bannerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 3,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D6D6D6",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 22,
    backgroundColor: Colors.primary,
  },
});
