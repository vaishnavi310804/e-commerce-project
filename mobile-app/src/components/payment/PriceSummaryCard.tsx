import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  subtotal: number;
  shippingCharge: number;
  tax: number;
  discount: number;
  totalAmount: number;
};

const PriceSummaryCard = ({
  subtotal,
  shippingCharge,
  tax,
  discount,
  totalAmount,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Shipping</Text>
        <Text style={styles.value}>
          {shippingCharge === 0
            ? "Free"
            : `₹${shippingCharge.toFixed(2)}`}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tax</Text>
        <Text style={styles.value}>₹{tax.toFixed(2)}</Text>
      </View>

      {discount > 0 && (
        <View style={styles.row}>
          <Text style={styles.discountLabel}>Discount</Text>
          <Text style={styles.discountValue}>
            -₹{discount.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          ₹{totalAmount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default PriceSummaryCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  label: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  value: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  discountLabel: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: "#16A34A",
  },

  discountValue: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: "#16A34A",
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 8,
  },

  totalLabel: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  totalValue: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
});