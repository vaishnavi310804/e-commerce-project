import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import {
  getCart,
  CartData,
  updateCart,
  removeFromCart,
} from "@/src/api/cart.api";
import { getDefaultAddress, Address } from "@/src/api/address.api";
import Colors from "@/src/constants/colors";
import CartItems from "@/src/components/cart/CartItems";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import Fonts from "@/src/constants/fonts";
import PriceDetails from "@/src/components/cart/PriceDetails";
import ShippingAddressCard from "@/src/components/cart/ShippingAddressCard";

const CartScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartData | null>(null);
  const [address, setAddress] = useState<Address | null>(null);

  const fetchCartAndAddress = async (showLoadingSpinner = false) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      const [cartRes, addressRes] = await Promise.allSettled([
        getCart(),
        getDefaultAddress(),
      ]);

      if (cartRes.status === "fulfilled") {
        setCart(cartRes.value.data);
      }
      if (addressRes.status === "fulfilled" && addressRes.value?.data) {
        setAddress(addressRes.value.data);
      } else {
        setAddress(null);
      }
    } catch (error) {
      console.log("Error fetching cart/address:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartAndAddress(false);
    }, []),
  );

  const handleFetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading && !cart) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenWrapper>
    );
  }

  const handleIncrease = async (productId: string, currentQuantity: number) => {
    try {
      await updateCart(productId, currentQuantity + 1);
      handleFetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrease = async (productId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) return;

    try {
      await updateCart(productId, currentQuantity - 1);
      handleFetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId);
      handleFetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddressPress = () => {
    router.push("/address");
  };

  const handleCheckout = () => {
    if (!address) {
      Alert.alert(
        "No Address Found",
        "Please add a shipping address before proceeding to checkout.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add Address",
            onPress: () => router.push("/address"),
          },
        ],
      );
      return;
    }
    router.push({
      pathname: "/payment-method",
      params: { addressId: address._id },
    });
  };

  const rawSubtotal = cart?.items
    ? cart.items.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0,
      )
    : 0;

  const discount = cart?.items
    ? cart.items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        const discountPrice = item.product?.discountPrice;
        if (discountPrice && discountPrice < price) {
          return sum + (price - discountPrice) * item.quantity;
        }
        return sum;
      }, 0)
    : 0;

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        style={styles.flex1}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        data={cart?.items || []}
        keyExtractor={(item, index) => item.product?._id || index.toString()}
        renderItem={({ item }) => (
          <CartItems
            item={item}
            onIncrease={() =>
              item.product?._id &&
              handleIncrease(item.product._id, item.quantity)
            }
            onDecrease={() =>
              item.product?._id &&
              handleDecrease(item.product._id, item.quantity)
            }
            onRemove={() => item.product?._id && handleRemove(item.product._id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={70} color={Colors.gray} />
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        }
        ListFooterComponent={
          cart?.items && cart.items.length > 0 ? (
            <View style={styles.footerContainer}>
              <ShippingAddressCard
                address={address}
                onPress={handleAddressPress}
              />
              <PriceDetails
                subtotal={rawSubtotal}
                discount={discount}
                delivery={0}
              />
            </View>
          ) : null
        }
      />

      {cart?.items && cart.items.length > 0 ? (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.checkoutButton}
            activeOpacity={0.8}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScreenWrapper>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },

  footerContainer: {
    marginTop: 10,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    elevation: 10,
    zIndex: 100,
  },

  checkoutButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  checkoutText: {
    color: "#FFF",
    fontFamily: Fonts.bold,
    fontSize: 17,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },

  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },
});
