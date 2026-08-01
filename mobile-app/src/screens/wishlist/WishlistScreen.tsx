import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import ProductGridCard from "@/src/components/wishlist/ProductGridCard";
import { getWishlist, toggleWishlist } from "@/src/api/wishlist.api";
import { Product } from "@/src/api/product.api";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

const WishlistScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchWishlist = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await getWishlist();
      if (response.data) {
        const validProducts = response.data
          .map((item) => item.product)
          .filter((product): product is Product => Boolean(product && product._id));
        setProducts(validProducts);
      }
    } catch (error: any) {
      console.error("Error fetching wishlist:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist(true);

    const unsubscribe = navigation.addListener("focus", () => {
      fetchWishlist(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handleToggleWishlist = async (productId: string) => {
    const previousProducts = [...products];

    setProducts((prev) => prev.filter((product) => product._id !== productId));

    try {
      await toggleWishlist(productId);
    } catch (error: any) {
      console.error("Error removing product from wishlist:", error);
      setProducts(previousProducts);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update wishlist."
      );
    }
  };

  if (loading && products.length === 0) {
    return (
      <ScreenWrapper backgroundColor="#F8F8F8">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor="#F8F8F8">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconCircle}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Wishlist</Text>

          <TouchableOpacity style={styles.iconCircle} activeOpacity={0.8}>
            <Ionicons name="search-outline" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProductGridCard
                product={item}
                isWishlisted={true}
                onPress={() => router.push(`/product/${item._id}`)}
                onWishlist={() => handleToggleWishlist(item._id)}
              />
            )}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  categoryContainer: {
    marginVertical: 12,
  },

  categoryScroll: {
    paddingHorizontal: 20,
  },

  chip: {
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: Colors.primary,
  },

  inactiveChip: {
    backgroundColor: "#F3F4F6",
  },

  chipText: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
  },

  activeChipText: {
    color: "#FFFFFF",
  },

  inactiveChipText: {
    color: "#6B7280",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },

  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  listContent: {
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 100,
  },

  columnWrapper: {
    justifyContent: "space-between",
  },
});