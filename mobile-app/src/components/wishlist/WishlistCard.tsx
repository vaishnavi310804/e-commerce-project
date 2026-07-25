import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/src/api/product.api";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  product: Product;
  isWishlisted?: boolean;
  onPress: () => void;
  onWishlist?: () => void;
  onAddToCart?: () => void;
};

const WishlistCard = ({
  product,
  isWishlisted = true,
  onPress,
  onWishlist,
}: Props) => {
  const price = product?.price ?? 0;
  const discountPrice = product?.discountPrice ?? 0;

  const hasDiscount = Boolean(discountPrice > 0 && discountPrice < price);

  const finalPrice = hasDiscount ? discountPrice : price;
  const discountPercentage = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const rating = product?.averageRating ?? 4.9;
  const categoryOrBrand =
    (product as any)?.category?.name || product?.brand || "Electronics";
  const imageUrl =
    product?.productImage?.url || "https://via.placeholder.com/150";

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Top Image Container */}
      <View style={styles.imageBox}>
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercentage}%</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.heartButton}
          activeOpacity={0.8}
          onPress={onWishlist}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={18}
            color="#FF3B30"
          />
        </TouchableOpacity>

        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Details Container */}
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {product?.name || "Product Name"}
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text numberOfLines={1} style={styles.categoryText}>
          {categoryOrBrand}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{finalPrice}</Text>

          {hasDiscount && (
            <Text style={styles.oldPrice}>₹{price}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default WishlistCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    marginBottom: 14,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#F1F1F4",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  imageBox: {
    height: 130,
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  image: {
    width: "82%",
    height: "82%",
  },

  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },

  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#EF4444",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    zIndex: 10,
  },

  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: Fonts.bold,
  },

  details: {
    marginTop: 10,
    paddingHorizontal: 2,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginRight: 6,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: "#374151",
    marginLeft: 3,
  },

  categoryText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: "#9CA3AF",
    marginTop: 2,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  price: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  oldPrice: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
});