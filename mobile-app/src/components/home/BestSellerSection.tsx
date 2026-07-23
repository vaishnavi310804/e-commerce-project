import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, } from "react-native";
import SectionHeader from "./SectionHeader";
import ProductCard from "../products/ProductCard";
import { Product, getProducts, getProductById } from "@/src/api/product.api";
import { router } from "expo-router";

const BestSellerSection = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Best Seller"
        onSeeAll={() => {}}
      />
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/product/${item._id}`)}
            onWishlist={() => {}}
            onAddToCart={() => {}}
          />
        )}
      />
    </View>
  );
};

export default BestSellerSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
});