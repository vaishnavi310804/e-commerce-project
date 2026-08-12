import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../../api/product.api";
import Colors from "@/src/constants/colors";

type Props = {
  product: Product;
  isWishlisted?: boolean;
  onPress: () => void;
  onWishlist?: () => void;
  style?: StyleProp<ViewStyle>;
};

const ProductCard = ({
  product,
  isWishlisted = false,
  onPress,
  onWishlist,
  style,
}: Props) => {
  const price = product?.price ?? 0;
  const discountPrice = product?.discountPrice ?? 0;

  const finalAmount = discountPrice > 0 && discountPrice < price;

  const finalPrice = finalAmount ? discountPrice : price;

  const rating = product?.averageRating ?? 0;
  const reviewsCount = product?.numReviews ?? 0;
  const imageUrl =
    product?.productImage?.url || "https://via.placeholder.com/150";

  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />

        <Pressable
          style={styles.wishlistButton}
          onPress={(e) => {
            e.stopPropagation();
            onWishlist?.();
          }}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={20}
            color={isWishlisted ? "#FF4B55" : "#FF4B55"}
          />
        </Pressable>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {product?.name || "Product"}
          </Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F59E0B" />

            <Text style={styles.rating}>
              {rating > 0 ? rating.toFixed(1) : "0.0"}
            </Text>
          </View>
        </View>

        <Text numberOfLines={1} style={styles.category}>
          {product?.category?.name || "Category"}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{finalPrice.toFixed(2)}</Text>

          {finalAmount && (
            <Text style={styles.oldPrice}>₹{price.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: 174,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 7,
    overflow: "hidden",
    marginTop: 12,
  },

  imageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#F7F7F7",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  image: {
    width: "88%",
    height: "88%",
  },

  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  infoContainer: {
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingBottom: 4,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    marginRight: 5,

    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  rating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444444",
  },

  category: {
    marginTop: 4,

    fontSize: 13,
    color: "#8A8A8A",

    fontWeight: "400",
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 7,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
  },

  oldPrice: {
    marginLeft: 7,
    fontSize: 13,
    color: "#999999",
    textDecorationLine: "line-through",
  },
});