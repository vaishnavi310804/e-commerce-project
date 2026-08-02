import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { Product } from "@/src/api/product.api";

type ReceiptItem = {
  itemNumber: string;
  quantity: number;
  price: number;
  product: Product;
};

type Props = {
  item: ReceiptItem;
};

const ReceiptProductCard = ({ item }: Props) => {
  const { product, quantity, price, itemNumber } = item;

  const total = quantity * price;

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: product?.productImage?.url,
        }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product?.name}
        </Text>

        {!!product?.brand && <Text style={styles.brand}>{product.brand}</Text>}

        <Text style={styles.itemNumber}>Item ID: {itemNumber}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.quantity}>Qty: {quantity}</Text>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.unitPrice}>₹{price} each</Text>

            <Text style={styles.price}>₹{total}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReceiptProductCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  image: {
    width: 85,
    height: 85,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    padding: 8,
  },

  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  brand: {
    marginTop: 3,
    fontSize: 13,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },

  itemNumber: {
    marginTop: 10,
    fontSize: 12,
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },

  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  quantity: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },
  unitPrice: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    marginBottom: 2,
  },
  price: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
});
