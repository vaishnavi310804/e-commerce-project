import { useEffect, useState } from "react";
import {
  FlatList,
  View,
} from "react-native";
import {
  Category,
  getCategories,
} from "@/src/api/category.api";
import CategoryItem from "./CategoryItem";
import SectionHeader from "./SectionHeader";

export default function CategorySection() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

 const fetchCategories = async () => {
  try {
    const response = await getCategories();

    console.log("Category API Response:", response);
    console.log("Categories:", response.data);

    setCategories(response.data ?? []);
  } catch (error) {
    console.log("Category Error:", error);
  }
};
console.log("Categories State:", categories);
  return (
    <View className="mt-2">
      <SectionHeader
        title="Categories"
        onSeeAll={() => {}}
      />

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        renderItem={({ item }) => (
          <CategoryItem
            item={item}
            onPress={() => {}}
          />
        )}
      />
    </View>
  );
}