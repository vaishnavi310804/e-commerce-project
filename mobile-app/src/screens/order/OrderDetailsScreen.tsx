import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

import { getMyOrderDetails, OrderData } from "@/src/api/order.api";

const OrderDetailsScreen = () => {
  const { orderId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);

  const fetchOrder = async () => {
    try {
      const response = await getMyOrderDetails(orderId as string);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenWrapper>
    );
  }

  if (!order) {
    return (
      <ScreenWrapper>
        <Text>Order not found.</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Order Details</Text>

          <View style={{ width: 24 }} />
        </View>

        {/* Status */}

        <View style={styles.statusContainer}>
          <OrderStatus status={order.orderStatus} />

          <Text style={styles.date}>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Products */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>

          {order.products.map((item) => (
            <OrderProduct key={item.product._id} item={item} />
          ))}
        </View>

        {/* Shipping Card */}

        {/* Payment Card */}

        {/* Price Summary */}

        {/* Bottom Button */}
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
});
