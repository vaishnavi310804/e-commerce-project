import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

export type BannerItemProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  image: any;
  backgroundColor: string;
  imageWidth?: number;
  imageHeight?: number;
  onPress?: () => void;
};

const BannerItem = ({
  title,
  subtitle,
  buttonText,
  image,
  imageWidth,
  imageHeight,
  backgroundColor,
  onPress,
}: BannerItemProps) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.subtitle}>{subtitle}</Text>

        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
      </View>

      <Image
        source={image}
        resizeMode="contain"
        style={[
          styles.image,
          {
            width: imageWidth,
            height: imageHeight,
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
    flexDirection: "row",
    overflow: "hidden",
    position: "relative",
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingRight: 0,
    zIndex: 2,
  },

  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.black,
  },

  subtitle: {
    fontSize: 15,
    marginTop: 5,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },

  button: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 8,
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
