import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import OrderProduct from "./OrderProduct";
import OrderStatus from "./OrderStatus";

type Props = {
  order: any;
  onPress: () => void;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
};

const OrderCard = ({
  order,
  onPress,
  onPrimaryAction,
  onSecondaryAction,
}: Props) => {
  const getButtons = () => {
    switch (order.orderStatus) {
      case "Placed":
      case "Shipped":
        return {
          left: "Cancel",
          right: "Track Order",
        };

      case "Delivered":
        return {
          left: "Leave Review",
          right: "View E-Receipt",
        };

      case "Cancelled":
        return {
          left: "",
          right: "Re-Order",
        };

      default:
        return {
          left: "",
          right: "",
        };
    }
  };

  const buttons = getButtons();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={onPress}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.orderId}>
          Order ID : #{order.orderNumber}
        </Text>

        <OrderStatus status={order.orderStatus} />
      </View>

      <View style={styles.divider} />

      {order.products.map((item: any) => (
        <OrderProduct
          key={item.product._id}
          item={item}
        />
      ))}

      <View style={styles.divider} />

      <Text style={styles.summary}>
        {order.products.length} Item
        {order.products.length > 1 ? "s" : ""} • Total ₹
        {order.totalAmount.toFixed(2)}
      </Text>

      <View style={styles.divider} />

      <View style={styles.buttonRow}>
        {buttons.left ? (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onSecondaryAction}
          >
            <Text style={styles.secondaryText}>
              {buttons.left}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onPrimaryAction}
        >
          <Text style={styles.primaryText}>
            {buttons.right}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderId: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F1F1",
    marginVertical: 16,
  },

  summary: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  secondaryText: {
    fontFamily: Fonts.semibold,
    color: Colors.primary,
    fontSize: 15,
  },

  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
});