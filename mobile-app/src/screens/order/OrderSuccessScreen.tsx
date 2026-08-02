import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import SuccessIcon from "@/src/components/order/Success";
import SuccessActions from "@/src/components/order/SuccessButtons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

const OrderSuccessScreen = () => {
  const { orderId } = useLocalSearchParams();

  return (
    <ScreenWrapper>
      <TouchableOpacity
        style={styles.back}
        onPress={() => router.replace("/(tabs)")}
      >
        <Ionicons name="chevron-back" size={22} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <SuccessIcon />

        <Text style={styles.title}>Order Placed!</Text>

        <Text style={styles.subtitle}>Thank you for your purchase.</Text>
      </View>

      <SuccessActions
        orderId={orderId as string}
        onViewOrder={() =>
          router.push({
            pathname: "/order-details",
            params: {
              orderId,
            },
          })
        }
        onReceipt={(orderId) =>
          router.push({
            pathname: "/receipt/[orderId]" as any,
            params: {
              orderId,
            },
          })
        }
      />
    </ScreenWrapper>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  back: {
    marginLeft: 20,
    marginTop: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  title: {
    marginTop: 28,
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.gray,
    fontFamily: Fonts.regular,
  },
});
