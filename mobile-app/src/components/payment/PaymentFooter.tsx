import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  onPress: () => void;
  paymentMethod: "COD" | "RAZORPAY";
  loading?: boolean;
  disabled?: boolean;
};

const PaymentFooter = ({
  onPress,
  paymentMethod,
  loading = false,
  disabled = false,
}: Props) => {
  const buttonText = loading
    ? "Processing..."
    : paymentMethod === "COD"
      ? "Confirm Order"
      : "Proceed to Pay";

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.button,
            (loading || disabled) && styles.buttonDisabled,
          ]}
          onPress={onPress}
          disabled={loading || disabled}
        >
          <Text style={styles.buttonText}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentFooter;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFF",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#FFF",

    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 8,
  },

  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,

    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});