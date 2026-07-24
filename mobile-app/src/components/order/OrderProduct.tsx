import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  item: {
    quantity: number;
    price: number;
    product: {
      _id: string;
      name: string;
      category?: {
        name: string;
      };
      image?: {
        url: string;
      };
      productImage?: {
        url: string;
      };
      price: number;
      discountPrice?: number;
    };
  };
};

const OrderProduct = ({ item }: Props) => {
  const product = item.product;

  const image =
    product?.productImage?.url ||
    product?.image?.url ||
    "https://via.placeholder.com/80";

  const originalPrice = product?.price ?? item.price;
  const sellingPrice = item.price;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }}
        style={styles.image}
      />

      <View style={styles.details}>
        <Text
          numberOfLines={1}
          style={styles.name}
        >
          {product.name}
        </Text>

        <Text style={styles.category}>
          {product.category?.name ?? "Product"} • Qty : {item.quantity}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₹{sellingPrice.toFixed(2)}
          </Text>

          {originalPrice > sellingPrice && (
            <Text style={styles.originalPrice}>
              ₹{originalPrice.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default OrderProduct;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 12,
  },

  image: {
    width: 82,
    height: 82,
    borderRadius: 10,
    backgroundColor: "#F8F8F8",
  },

  details: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  name: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  category: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  price: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  originalPrice: {
    marginLeft: 8,
    fontSize: 15,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    fontFamily: Fonts.medium,
  },
});