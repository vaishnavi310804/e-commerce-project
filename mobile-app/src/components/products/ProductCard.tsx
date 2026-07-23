import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../../api/product.api";
import Colors from "@/src/constants/colors";

type Props = {
  product: Product;
  onPress: () => void;
  onWishlist?: () => void;
  onAddToCart?: () => void;
};

const ProductCard = ({ product, onPress, onWishlist, onAddToCart }: Props) => {
  const discountAmount =
    product.discountPrice > 0 && product.discountPrice < product.price;

  const finalPrice = discountAmount ? product.discountPrice : product.price;
  const discountPercentage = discountAmount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Pressable style={styles.wishlist} onPress={onWishlist}>
        <Ionicons name="heart-outline" size={20} color={Colors.primary} />
      </Pressable>

      {discountAmount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discountPercentage}%</Text>
        </View>
      )}

      <Image
        source={{
          uri: product.productImage.url,
        }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text numberOfLines={2} style={styles.title}>
        {product.name}
      </Text>
      <Text numberOfLines={1} style={styles.brand}>
        {product.brand}
      </Text>

      <View style={styles.ratingRow}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FDBA12" />

          <Text style={styles.rating}>{product.averageRating.toFixed(1)}</Text>

          <Text style={styles.review}>({product.numReviews})</Text>
        </View>

        <Pressable style={styles.cartButton} onPress={onAddToCart}>
          <Ionicons name="cart-outline" size={18} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{finalPrice}</Text>

        {discountAmount && (
          <Text style={styles.oldPrice}>₹{product.price}</Text>
        )}
      </View>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginRight: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 4,
  },

  wishlist: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 10,
  },

  discountBadge: {
    position: "absolute",
    left: 12,
    top: 12,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 10,
  },

  discountText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 10,
  },

  image: {
    width: "100%",
    height: 120,
    marginTop: 15,
    marginBottom: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    minHeight: 35,
  },

  brand: {
  fontSize: 13,
  color: "#757575",
  fontWeight: "500",
},
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  rating: {
    marginLeft: 4,
    fontWeight: "600",
    color: "#444",
  },

  review: {
    marginLeft: 4,
    color: "#888",
    fontSize: 12,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },

  oldPrice: {
    marginLeft: 8,
    color: "#999",
    textDecorationLine: "line-through",
    fontSize: 14,
  },

  cartButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
