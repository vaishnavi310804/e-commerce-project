import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import ReceiptHeader from "@/src/components/receipt/ReceiptHeader";
import ReceiptInvoiceCard from "@/src/components/receipt/ReceiptInvoiceCard";
import ReceiptCustomerCard from "@/src/components/receipt/ReceiptCustomerCard";
import ReceiptProductCard from "@/src/components/receipt/ReceiptProductCard";
import ReceiptPriceSummaryCard from "@/src/components/receipt/ReceiptPriceSummaryCard";
import { getMyOrderDetails, OrderData } from "@/src/api/order.api";

import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

const ReceiptScreen = () => {
  const { orderId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    fetchReceipt();
  }, [orderId]);

  const fetchReceipt = async () => {
    try {
      if (!orderId) return;

      const response = await getMyOrderDetails(orderId as string);

      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.log("Receipt Error:", error);
      Alert.alert("Error", "Unable to load receipt.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    Alert.alert(
      "Coming Soon",
      "Share receipt will be available soon."
    );
  };

  const handleDownload = () => {
    Alert.alert(
      "Coming Soon",
      "PDF download will be available soon."
    );
  };

  if (loading) {
    return (
      <ScreenWrapper backgroundColor="#F8F8F8">
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 50 }}
        />
      </ScreenWrapper>
    );
  }

  if (!order) {
    return (
      <ScreenWrapper backgroundColor="#F8F8F8">
        <Text style={styles.emptyText}>
          Receipt not found.
        </Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor="#F8F8F8">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <ReceiptHeader onShare={handleShare} />

        <ReceiptInvoiceCard
          invoiceNumber={order.invoiceNumber}
          orderNumber={order.orderNumber}
          orderDate={new Date(order.createdAt).toLocaleDateString()}
          orderStatus={order.orderStatus}
          paymentStatus={order.paymentStatus}
        />

        <ReceiptCustomerCard
          address={order.shippingAddress}
        />

        {order.products.map((item) => (
          <ReceiptProductCard
            key={item.itemNumber}
            item={item}
          />
        ))}

        <ReceiptPriceSummaryCard
          subtotal={order.subtotal}
          discount={order.discount}
          shippingCharge={order.shippingCharge}
          tax={order.tax}
          totalAmount={order.totalAmount}
        />

        <TouchableOpacity
          style={styles.downloadButton}
          activeOpacity={0.8}
          onPress={handleDownload}
        >
          <Text style={styles.downloadText}>
            Download PDF
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  downloadButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  downloadText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },

  emptyText: {
    marginTop: 80,
    textAlign: "center",
    color: Colors.gray,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
});