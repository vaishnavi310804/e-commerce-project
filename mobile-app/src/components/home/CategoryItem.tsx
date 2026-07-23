import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Category } from "@/src/api/category.api";
import Colors from "@/src/constants/colors";

type Props = {
  item: Category;
  onPress: () => void;
};

const CategoryItem = ({ item, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        {item.image?.url ? (
          <Image
            source={{ uri: item.image.url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.placeholderText}>
            {item.name.charAt(0)}
          </Text>
        )}
      </View>

      <Text
        style={styles.name}
        numberOfLines={2}
      >
        {item.name}
      </Text>
    </Pressable>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  container: {
    width: 80,
    alignItems: "center",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary,
  },
  name: {
    fontSize: 12,
    textAlign: "center",
    color: Colors.text,
  },
});