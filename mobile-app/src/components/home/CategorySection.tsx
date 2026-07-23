import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {Category,getCategories} from "@/src/api/category.api";
import CategoryItem from "./CategoryItem";
import SectionHeader from "./SectionHeader";

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();

      setCategories(response.data ?? []);
    } catch (error) {
      console.log("Category Error:", error);
    }
  };

  console.log("Categories State:", categories);

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Categories"
        onSeeAll={() => {}}
      />

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CategoryItem
            item={item}
            onPress={() => {}}
          />
        )}
      />
    </View>
  );
};

export default CategorySection;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});