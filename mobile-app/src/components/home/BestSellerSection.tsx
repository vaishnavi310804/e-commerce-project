import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import SectionHeader from "./SectionHeader";
import ProductCard from "../products/ProductCard";
import { Product, getProducts } from "@/src/api/product.api";
import { router, useNavigation } from "expo-router";
import { getWishlist, toggleWishlist } from "@/src/api/wishlist.api";

const BestSellerSection = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setwishlist] = useState<string[]>([]);

  useEffect(() => {
    fetchData();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      const [productResponse, wishlistResponse] = await Promise.all([
        getProducts(),
        getWishlist(),
      ]);
      setProducts(productResponse.data ?? []);
      if (wishlistResponse.data) {
        setwishlist(
          wishlistResponse.data
            .map((item: any) => item.product?._id)
            .filter(Boolean),
        );
      }
    } catch (error) {
      console.log("Error fetching home best seller data:", error);
    }
  };

  const handleWishlist = async (productId: string) => {
    try {
      const response = await toggleWishlist(productId);
      setwishlist((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      );
      if (response.message) {
        Alert.alert("Wishlist", response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Best Seller" onSeeAll={() => {}} />

      <View style={styles.grid}>
        {products.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
            isWishlisted={wishlist.includes(item._id)}
            onPress={() => router.push(`/product/${item._id}`)}
            onWishlist={() => handleWishlist(item._id)}
            style={styles.card}
          />
        ))}
      </View>
    </View>
  );
};

export default BestSellerSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    marginBottom: 16,
  },
});