import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Category } from "@/src/api/category.api";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  item: Category;
  selected: boolean;
  onPress: () => void;
};

type IconName = keyof typeof Ionicons.glyphMap;

const categoryIcons: Record<string, IconName> = {
  shirt: "shirt-outline",
  mobile: "phone-portrait-outline",
  watch: "watch-outline",
  laptop: "laptop-outline",
  audio: "headset-outline",
  bag: "bag-handle-outline",
  shoes: "footsteps-outline",
  home: "home-outline",
  books: "book-outline",
  gaming: "game-controller-outline",
  beauty: "color-palette-outline",
  toy: "game-controller-outline",
};

const CategoryItem = ({ item, onPress, selected }: Props) => {
  const iconName = categoryIcons[item.icon || ""] || "-";

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, selected && styles.selectedContainer]}
    >
      <View
        style={[
          styles.iconContainer,
          selected && styles.selectedIconContainer,
        ]}
      >
        {item.image?.url ? (
          <Image
            source={{ uri: item.image.url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Ionicons
            name={iconName}
            size={18}
            color={selected ? Colors.white : Colors.black}
          />
        )}
      </View>

      <Text
        style={[styles.name, selected && styles.selectedName]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </Pressable>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 24,
    paddingLeft: 5,
    paddingRight: 15,
    marginRight: 8,
    maxWidth: "100%",
  },

  selectedContainer: {
    backgroundColor: Colors.primary,
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 7,
  },

  selectedIconContainer: {
    backgroundColor: '#836dcf',
  },

  image: {
    width: "100%",
    height: "100%",
  },

  name: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.black,
    flexShrink: 1,
  },

  selectedName: {
    color: Colors.white,
    fontFamily: Fonts.medium,
  },
});