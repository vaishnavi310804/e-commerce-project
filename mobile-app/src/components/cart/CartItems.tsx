import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import Colors from '@/src/constants/colors';
import Fonts from '@/src/constants/fonts';
import { CartItem } from '@/src/api/cart.api';

type CartItemsProps ={
    item: CartItem;
    onIncrese: ()=> void;
    onDecrease: ()=> void;
    onRemove: ()=> void;
}

const CartItems = ({item, onIncrese, onDecrease, onRemove}: CartItemsProps) => {
    const price = item.product.discountPrice ?? item.product.price;
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.product.productImage.url }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.details}>
        <Text
          style={styles.name}
          numberOfLines={2}
        >
          {item.product.name}
        </Text>

        {item.product.brand ? (
          <Text style={styles.brand}>
            {item.product.brand}
          </Text>
        ) : null}

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₹{price}
          </Text>

          {item.product.discountPrice && (
            <Text style={styles.oldPrice}>
              ₹{item.product.price}
            </Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={onDecrease}
            >
              <Ionicons
                name="remove"
                size={18}
                color={Colors.text}
              />
            </TouchableOpacity>

            <Text style={styles.quantity}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={styles.qtyButton}
              onPress={onIncrese}
            >
              <Ionicons
                name="add"
                size={18}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onRemove}>
            <Ionicons
              name="trash-outline"
              size={22}
              color="#EF4444"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default CartItems

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: "#F8F8F8",
  },

  details: {
    flex: 1,
    marginLeft: 20,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  brand: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 4,
    fontFamily: Fonts.regular,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  price: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },

  oldPrice: {
    marginLeft: 8,
    textDecorationLine: "line-through",
    color: Colors.gray,
    fontFamily: Fonts.regular,
  },

  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  quantity: {
    marginHorizontal: 14,
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
})