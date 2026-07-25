import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";


type Props = {
  paymentMethod: string;
  paymentStatus: string;
};

const PaymentDetailsCard = ({
  paymentMethod,
  paymentStatus,
}: Props) => {
  const isPaid = paymentStatus.toLowerCase() === "paid";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={
              paymentMethod.toLowerCase().includes("cash")
                ? "cash-outline"
                : "card-outline"
            }
            size={24}
            color={Colors.primary}
          />
        </View>

        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.label}>Method</Text>
            <Text style={styles.value}>{paymentMethod}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isPaid
                    ? "#ECFDF5"
                    : "#FEF3C7",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: isPaid
                      ? "#16A34A"
                      : "#D97706",
                  },
                ]}
              >
                {paymentStatus}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PaymentDetailsCard;

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
    marginBottom: 16,
  },

  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  info: {
    flex: 1,
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

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    textTransform: "capitalize",
  },
});