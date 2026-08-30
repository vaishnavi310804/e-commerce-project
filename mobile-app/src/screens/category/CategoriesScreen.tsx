import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import BackButton from "@/src/components/common/BackButton";
import CategoryItem from "@/src/components/home/CategoryItem";
import {
  Category,
  getCategories,
} from "@/src/api/category.api";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data ?? []);
    } catch (error) {
      console.log("Categories Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper backgroundColor="#fff">
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor="#fff">
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton />

          <Text style={styles.title}>
            Categories
          </Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.chipsWrapper}>
            {categories.map((item) => (
              <CategoryItem
                key={item._id}
                item={item}
                selected={false}
                onPress={() =>
                  router.push({
                    pathname: "/category/[categoryId]",
                    params: {
                      categoryId: item._id,
                      categoryName: item.name,
                      slug: item.slug,
                    },
                  })
                }
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  chipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: 12,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});