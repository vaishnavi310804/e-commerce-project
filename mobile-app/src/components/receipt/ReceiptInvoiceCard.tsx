import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  invoiceNumber: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  orderDate: string;
};

const ReceiptInvoiceCard = ({
  invoiceNumber,
  orderNumber,
  orderStatus,
  paymentStatus,
  orderDate,
}: Props) => {
  const getStatusBadge = (
    status: string,
    type: "order" | "payment"
  ) => {
    if (type === "order") {
      switch (status) {
        case "Placed":
        case "Confirmed":
        case "Processing":
        case "Packed":
        case "Shipped":
          return {
            backgroundColor: "#FEF3C7",
            color: "#B45309",
          };

        case "Delivered":
          return {
            backgroundColor: "#DCFCE7",
            color: "#15803D",
          };

        case "Cancelled":
          return {
            backgroundColor: "#FEE2E2",
            color: "#DC2626",
          };

        default:
          return {
            backgroundColor: "#F3F4F6",
            color: Colors.text,
          };
      }
    }

    switch (status) {
      case "Paid":
        return {
          backgroundColor: "#DCFCE7",
          color: "#15803D",
        };

      case "Pending":
        return {
          backgroundColor: "#FEF3C7",
          color: "#B45309",
        };

      case "Failed":
      case "Refunded":
        return {
          backgroundColor: "#FEE2E2",
          color: "#DC2626",
        };

      default:
        return {
          backgroundColor: "#F3F4F6",
          color: Colors.text,
        };
    }
  };

  const orderBadge = getStatusBadge(orderStatus, "order");
  const paymentBadge = getStatusBadge(paymentStatus, "payment");

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Invoice Number</Text>
        <Text style={styles.value}>{invoiceNumber}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Order Number</Text>
        <Text style={styles.value}>{orderNumber}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Order Date</Text>
        <Text style={styles.value}>{orderDate}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Order Status</Text>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: orderBadge.backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: orderBadge.color,
              },
            ]}
          >
            {orderStatus}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Payment Status</Text>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: paymentBadge.backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: paymentBadge.color,
              },
            ]}
          >
            {paymentStatus}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReceiptInvoiceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  value: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 14,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
  },
});