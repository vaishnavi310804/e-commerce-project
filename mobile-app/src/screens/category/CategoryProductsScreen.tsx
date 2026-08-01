import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import BackButton from "@/src/components/common/BackButton";
import ProductGridCard from "@/src/components/wishlist/ProductGridCard";
import {
  getProductsByCategory,
  Product,
} from "@/src/api/product.api";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

export default function CategoryProductsScreen() {
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProductsByCategory(categoryId);

      setProducts(response.data ?? []);
    } catch (error) {
      console.log("Category Products Error:", error);
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
            {categoryName}
          </Text>

          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductGridCard
              product={item}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: {
                    id: item._id,
                  },
                })
              }
              onWishlist={() => {}}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                No products found.
              </Text>
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
}

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

  list: {
    paddingBottom: 30,
  },

  row: {
    justifyContent: "space-between",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    marginTop: 100,
    alignItems: "center",
  },

  emptyText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: "#888",
  },
});