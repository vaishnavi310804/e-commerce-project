import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import PaymentSection from "@/src/components/payment/PaymentSection";
import PaymentFooter from "@/src/components/payment/PaymentFooter";

import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { createOrder } from "@/src/api/order.api";
import { getDefaultAddress } from "@/src/api/address.api";

const PaymentMethodScreen = () => {
  const params = useLocalSearchParams();
  const addressIdParam = params.addressId as string;

  const [selected, setSelected] = useState<"COD" | "ONLINE" | "Card" | "UPI">("COD");
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);

      let targetAddressId = addressIdParam;

      if (!targetAddressId) {
        const addressRes = await getDefaultAddress();
        if (addressRes.data?._id) {
          targetAddressId = addressRes.data._id;
        }
      }

      if (!targetAddressId) {
        Alert.alert(
          "Address Required",
          "Please add or select a shipping address before proceeding.",
          [{ text: "Add Address", onPress: () => router.push("/address") }]
        );
        setLoading(false);
        return;
      }

      const response = await createOrder({
        addressId: targetAddressId,
        paymentMethod: selected,
      });

      if (response.data) {
        router.push({
          pathname: "/order-success",
          params: { orderId: response.data._id },
        });
      }
    } catch (error: any) {
      console.error("CREATE ORDER ERROR:", error?.response?.data || error?.message);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to place order. Please try again.";
      Alert.alert("Order Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
          <Ionicons
            name="chevron-back"
            size={26}
            color={Colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Payment Methods</Text>

        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PaymentSection
          title="Cash"
          options={[
            {
              id: "COD",
              title: "Cash on Delivery",
              icon: "cash-outline",
            },
          ]}
          selected={selected}
          onSelect={(val) => setSelected(val as any)}
        />

        <PaymentSection
          title="Wallet & Online"
          options={[
            {
              id: "ONLINE",
              title: "Online / Wallet",
              icon: "wallet-outline",
            },
          ]}
          selected={selected}
          onSelect={(val) => setSelected(val as any)}
        />

        <PaymentSection
          title="Credit & Debit Card"
          options={[
            {
              id: "CARD",
              title: "Add Card",
              icon: "card-outline",
              arrow: true,
              disabled: true,
            },
          ]}
          selected={selected}
          onSelect={(val) => setSelected(val as any)}
        />

        <PaymentSection
          title="More Payment Options"
          options={[
            {
              id: "PAYPAL",
              title: "Paypal",
              image: "paypal",
              disabled: true,
            },
            {
              id: "APPLE",
              title: "Apple Pay",
              image: "apple",
              disabled: true,
            },
            {
              id: "GOOGLE",
              title: "Google Pay",
              image: "google",
              disabled: true,
            },
          ]}
          selected={selected}
          onSelect={(val) => setSelected(val as any)}
        />
      </ScrollView>

      <PaymentFooter onPress={handleConfirmPayment} loading={loading} />
    </ScreenWrapper>
  );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  title: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.text,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
});