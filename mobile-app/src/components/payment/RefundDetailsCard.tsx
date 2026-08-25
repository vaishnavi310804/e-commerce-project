import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  refundStatus: "Not Applicable" | "Pending" | "Processed" | "Failed";
  refundAmount: number;
  refundDate?: string;
};

const RefundDetailsCard = ({
  refundStatus,
  refundAmount,
  refundDate,
}: Props) => {
  if (refundStatus === "Not Applicable") {
    return null;
  }

  const getStatusDetails = () => {
    switch (refundStatus) {
      case "Processed":
        return {
          title: "Refund Processed",
          message: "Your refund has been processed successfully.",
        };

      case "Pending":
        return {
          title: "Refund Pending",
          message: "Your refund is being processed.",
        };

      case "Failed":
        return {
          title: "Refund Failed",
          message: "We were unable to process your refund.",
        };

      default:
        return null;
    }
  };

  const statusDetails = getStatusDetails();

  if (!statusDetails) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Refund Details</Text>

      <View style={styles.statusRow}>

        <View style={styles.statusContent}>
          <Text style={styles.statusTitle}>{statusDetails.title}</Text>

          <Text style={styles.message}>
            {statusDetails.message}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <Text style={styles.label}>Refund Amount</Text>

        <Text style={styles.amount}>
          ₹{refundAmount.toFixed(2)}
        </Text>
      </View>

      {refundDate && (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Refund Date</Text>

          <Text style={styles.value}>
            {new Date(refundDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      )}
    </View>
  );
};

export default RefundDetailsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  heading: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 16,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  message: {
    marginTop: 3,
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 16,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  label: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  amount: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  value: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
});