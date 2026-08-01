import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  status: "Placed" | "Shipped" | "Delivered" | "Cancelled";
};

const OrderStatus = ({ status }: Props) => {
  const getStatusStyle = () => {
  switch (status) {
    case "Placed":
      return {
        backgroundColor: "#FFF7E8",
        borderColor: "#FDBA2D",
        color: "#F59E0B",
      };

    case "Shipped":
      return {
        backgroundColor: "#E0F2FE",
        borderColor: "#38BDF8",
        color: "#0284C7",
      };

    case "Delivered":
      return {
        backgroundColor: "#ECFDF5",
        borderColor: "#34D399",
        color: "#10B981",
      };

    case "Cancelled":
      return {
        backgroundColor: "#FEF2F2",
        borderColor: "#F87171",
        color: "#EF4444",
      };

    default:
      return {
        backgroundColor: "#F5F5F5",
        borderColor: "#DDD",
        color: Colors.text,
      };
  }
};

  const badge = getStatusStyle();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: badge.backgroundColor,
          borderColor: badge.borderColor,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: badge.color,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

export default OrderStatus;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },

  text: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
  },
});
