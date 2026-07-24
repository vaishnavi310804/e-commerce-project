import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import OrderCard from "@/src/components/order/OrderCard";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { getMyOrders } from "@/src/api/order.api";

const MyOrdersScreen = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.title}>My Orders</Text>

        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item: any) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <OrderCard
            order={item}
            onPress={() =>
              router.push({
                pathname: "/order-details",
                params: {
                  orderId: item._id,
                },
              })
            }
            onPrimaryAction={() => {}}
            onSecondaryAction={() => {}}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={70} color={Colors.gray} />

            <Text style={styles.emptyText}>No Orders Yet</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  list: {
    padding: 20,
    paddingBottom: 30,
  },

  empty: {
    marginTop: 120,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },
});
