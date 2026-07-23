import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import BannerItem from "./BannerItem";
import { banners } from "@/src/constants/banner";
import Colors from "@/src/constants/colors";

const { width } = Dimensions.get("window");

const BannerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={190}
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
              title={item.title}
              subtitle={item.subtitle}
              buttonText={item.buttonText}
              image={item.image}
              backgroundColor={item.backgroundColor}
            />
          </View>
        )}
      />

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default BannerCarousel;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  bannerWrapper: {
    paddingHorizontal: 20,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 2,
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