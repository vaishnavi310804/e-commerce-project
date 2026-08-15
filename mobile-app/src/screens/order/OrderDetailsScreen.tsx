import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import OrderProduct from "@/src/components/order/OrderProduct";
import OrderStatus from "@/src/components/order/OrderStatus";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { getMyOrderDetails, OrderData, cancelOrder } from "@/src/api/order.api";
import ShippingDetailsCard from "@/src/components/order/ShippingDetailsCard";
import PaymentDetailsCard from "@/src/components/payment/PaymentDetailsCard";
import PriceSummaryCard from "@/src/components/payment/PriceSummaryCard";

const OrderDetailsScreen = () => {
  const { orderId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      if (!orderId) return;
      const response = await getMyOrderDetails(orderId as string);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.log("Fetch Order Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleCancel = () => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          if (!order?._id) return;
          setCancelLoading(true);
          try {
            const response = await cancelOrder(order._id);
            if (response.success) {
              Alert.alert("Success", "Order cancelled successfully.");
              await fetchOrder();
            } else {
              Alert.alert(
                "Error",
                response.message || "Failed to cancel order.",
              );
            }
          } catch (error: any) {
            console.log(
              "Cancel Order Error:",
              error?.response?.data || error?.message,
            );
            Alert.alert(
              "Error",
              error?.response?.data?.message ||
                error?.message ||
                "Failed to cancel order.",
            );
          } finally {
            setCancelLoading(false);
          }
        },
      },
    ]);
  };

  const getActionButton = () => {
    if (!order) return null;

    switch (order.orderStatus) {
      case "Pending":
      case "Placed":
      case "Confirmed":
      case "Processing":
      case "Packed":
        return {
          title: "Cancel Order",
          onPress: handleCancel,
        };

      case "Shipped":
        return {
          title: "Track Order",
          onPress: () => {
            console.log("Track Order");
          },
        };

      case "Delivered":
        return {
          title: "Buy Again",
          onPress: () => {
            console.log("Buy Again");
          },
        };

      case "Cancelled":
        return {
          title: "Reorder",
          onPress: () => {
            console.log("Re-Order");
          },
        };

      default:
        return null;
    }
  };

  const action = getActionButton();

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 40 }}
        />
      </ScreenWrapper>
    );
  }

  if (!order) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Order not found.</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const productsList = order.products || [];

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Order Details</Text>

          <View style={{ width: 24 }} />
        </View>

        <View style={styles.statusContainer}>
          <OrderStatus status={order.orderStatus} />

          <Text style={styles.date}>
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Products ({productsList.length})
          </Text>

          {productsList.map((item, index) => (
            <OrderProduct
              key={item.product?._id || index.toString()}
              item={item}
            />
          ))}
        </View>

        <ShippingDetailsCard address={order.shippingAddress} />
        <PaymentDetailsCard
          paymentMethod={order.paymentMethod}
          paymentStatus={order.paymentStatus}
        />

        <PriceSummaryCard
          subtotal={order.subtotal}
          shippingCharge={order.shippingCharge}
          tax={order.tax}
          discount={order.discount}
          totalAmount={order.totalAmount}
        />

        <TouchableOpacity
          style={styles.receiptButton}
          activeOpacity={0.8}
          onPress={() => router.push(`/receipt/${order._id}`)}
        >
          <Ionicons name="receipt-outline" size={20} color={Colors.primary} />

          <Text style={styles.receiptText}>View E-Receipt</Text>
        </TouchableOpacity>

        {action && (
          <TouchableOpacity
            disabled={cancelLoading}
            style={[
              styles.actionButton,
              cancelLoading && styles.disabledButton,
            ]}
            onPress={action.onPress}
          >
            {cancelLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.actionText}>{action.title}</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  statusContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  date: {
    marginTop: 10,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },

  section: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginBottom: 10,
    color: Colors.text,
  },

  actionButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  disabledButton: {
    opacity: 0.7,
  },

  actionText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },

  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  receiptButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: "#F7F5FF",
    marginBottom: 20,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  receiptText: {
    marginLeft: 8,
    fontSize: 15,
    color: Colors.primary,
    fontFamily: Fonts.semibold,
  },
});
