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

const CategoryItem = ({ item, onPress, selected }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, selected && styles.selectedContainer]}
    >
      <View
        style={[styles.iconContainer, selected && styles.selectedIconContainer]}
      >
        {item.image?.url ? (
          <Image
            source={{ uri: item.image.url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Ionicons
            name="grid-outline"
            size={18}
            color={selected ? Colors.primary : Colors.black}
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
    backgroundColor: "#FFFFFF",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  name: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.black,
  },

  selectedName: {
    color: Colors.white,
    fontFamily: Fonts.medium,
  },
});
