import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

export type BannerItemProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  image: any;
  backgroundColor: string;
  onPress?: () => void;
};

const BannerItem = ({
  title,
  subtitle,
  buttonText,
  image,
  backgroundColor,
  onPress,
}: BannerItemProps) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.subtitle}>
          {subtitle}
        </Text>

        <Pressable
          style={styles.button}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>
            {buttonText}
          </Text>
        </Pressable>
      </View>

      <Image
        source={image}
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  );
};

export default BannerItem;

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 24,
    flexDirection: "row",
    overflow: "hidden",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.black,
  },

  subtitle: {
    fontSize: 15,
    marginTop: 8,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },

  button: {
    marginTop: 18,
    backgroundColor: Colors.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
  },

  buttonText: {
    color: Colors.white,
    fontFamily: Fonts.semibold,
    fontSize: 14,
  },

  image: {
    width: 130,
    height: 130,
  },
});