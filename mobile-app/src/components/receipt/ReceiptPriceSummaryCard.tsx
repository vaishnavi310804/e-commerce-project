import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
};

const ReceiptPriceSummaryCard = ({
  subtotal,
  discount,
  shippingCharge,
  tax,
  totalAmount,
}: Props) => {
  const Row = ({
    label,
    value,
    isTotal = false,
  }: {
    label: string;
    value: string;
    isTotal?: boolean;
  }) => (
    <View style={styles.row}>
      <Text
        style={[
          styles.label,
          isTotal && styles.totalLabel,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.value,
          isTotal && styles.totalValue,
        ]}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Price Summary
      </Text>

      <Row
        label="Subtotal"
        value={`₹${subtotal.toFixed(2)}`}
      />

      <Row
        label="Discount"
        value={`- ₹${discount.toFixed(2)}`}
      />

      <Row
        label="Shipping"
        value={
          shippingCharge === 0
            ? "Free"
            : `₹${shippingCharge.toFixed(2)}`
        }
      />

      <Row
        label="Tax"
        value={`₹${tax.toFixed(2)}`}
      />

      <View style={styles.divider} />

      <Row
        label="Grand Total"
        value={`₹${totalAmount.toFixed(2)}`}
        isTotal
      />
    </View>
  );
};

export default ReceiptPriceSummaryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  title: {
    fontSize: 16,
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
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  value: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 17,
    color: Colors.text,
    fontFamily: Fonts.bold,
  },

  totalValue: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },
});