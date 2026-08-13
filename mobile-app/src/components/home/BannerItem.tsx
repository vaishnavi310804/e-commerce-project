import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

export const banners = [
  {
    id: "1",
    title: "Exclusive Shopping Offers",
    subTitle: "Enjoy",
    highlightedTitle: "Extra Savings",
    discountLabel: "Up to",
    discountValue: "20",
    discountPer: "%",
    buttonText: "Shop Now",
    image: require("@/assets/images/carousal_pic_1.png"),
    backgroundColor: "#E0E0E0",
    imageWidth: 180,
    imageHeight: 180,
  },
  {
    id: "2",
    title: "Exclusive Shopping Offers",
    subTitle: "New",
    highlightedTitle: "Collection",
    discountLabel: "Up to",
    discountValue: "10",
    discountPer: "%",
    buttonText: "Explore",
    image: require("@/assets/images/carousal_pic_2.png"),
    backgroundColor: "#FFF4E5",
    imageWidth: 210,
    imageHeight: 180,
  },
];

export type BannerItemProps = {
  banner: (typeof banners)[number];
  onPress?: () => void;
};

const BannerItem = ({ banner, onPress }: BannerItemProps) => {
  return (
    <View style={[styles.container, { backgroundColor: banner.backgroundColor }]}>
      <View style={styles.content}>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {banner.title}
          </Text>
        </View>

        <Text style={styles.subtitle}>
          {banner.subTitle}{" "}
          <Text style={styles.highlightedTitle}>
            {banner.highlightedTitle}
          </Text>
        </Text>

        <View style={styles.discountRow}>
          <Text style={styles.discountLabel}>
            {banner.discountLabel}
          </Text>

          <Text style={styles.discountValue}>
            {banner.discountValue}
          </Text>

          <View style={styles.percentContainer}>
            <Text style={styles.discountPer}>
              {banner.discountPer}
            </Text>

            <Text style={styles.offText}>
              OFF
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.button}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>
            {banner.buttonText}
          </Text>
        </Pressable>

      </View>

      <Image
        source={banner.image}
        resizeMode="contain"
        style={[
          styles.image,
          {
            width: banner.imageWidth,
            height: banner.imageHeight,
          },
        ]}
      />
    </View>
  );
};

export default BannerItem;

const styles = StyleSheet.create({
  container: {
    height: 155,
    borderRadius: 20,
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  content: {
    width: "68%",
  },

  title: {
    alignSelf: "flex-start",
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 6,
  },

  titleText: {
    fontFamily: Fonts.medium,
    fontSize: 10,
  },

  subtitle: {
    fontSize: 20,
    lineHeight: 23,
    fontFamily: Fonts.bold,
    color: Colors.black,
  },

  highlightedTitle: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontStyle: "italic",
  },

  discountRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 0,
  },

  discountLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: "#222222",
    marginTop: 5,
  },

  discountValue: {
    fontFamily: Fonts.bold,
    fontSize: 40,
    lineHeight: 40,
    marginLeft: 4,
  },

  percentContainer: {
    marginLeft: 2,
    marginTop: 4,
  },

  discountPer: {
    fontFamily: Fonts.bold,
    fontSize: 12,
  },

  offText: {
    fontFamily: Fonts.medium,
    fontSize: 8,
    color: Colors.primary,
  },

  button: {
    marginTop: 5,
    backgroundColor: Colors.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },

  buttonText: {
    color: Colors.white,
    fontFamily: Fonts.semibold,
    fontSize: 12,
  },

  image: {
    position: "absolute",
    right: -8,
    bottom: -12,
  },
});
