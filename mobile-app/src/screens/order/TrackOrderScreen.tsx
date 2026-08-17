import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { getMyOrderDetails, OrderData } from "@/src/api/order.api";
import { getShipmentByOrder, ShipmentData } from "@/src/api/shipment.api";

const shipmentSteps = [
  "Pending",
  "Processing",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

const TrackOrderScreen = () => {
  const { orderId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!orderId) return;

        const id = orderId as string;

        const [orderResponse, shipmentResponse] = await Promise.all([
          getMyOrderDetails(id),
          getShipmentByOrder(id),
        ]);

        if (orderResponse.success) {
          setOrder(orderResponse.data);
        }

        if (shipmentResponse.success) {
          setShipment(shipmentResponse.data);
        }
      } catch (error) {
        console.log("Track Order Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimelineDate = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStepState = (step: string) => {
    if (!shipment) return "upcoming";

    if (shipment.status === "Cancelled") {
      return "cancelled";
    }

    if (shipment.status === "Failed") {
      return "failed";
    }

    const currentIndex = shipmentSteps.indexOf(shipment.status);
    const stepIndex = shipmentSteps.indexOf(step);

    if (stepIndex < currentIndex) {
      return "completed";
    }

    if (stepIndex === currentIndex) {
      return "current";
    }

    return "upcoming";
  };

  const getTimelineEntry = (status: string) => {
    if (!shipment?.timeline) return undefined;

    return shipment.timeline
      .slice()
      .reverse()
      .find((item) => item.status === status);
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 50 }}
        />
      </ScreenWrapper>
    );
  }

  if (!order || !shipment) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Track Order</Text>

            <View style={{ width: 24 }} />
          </View>

          <View style={styles.emptyContainer}>

            <Text style={styles.emptyTitle}>
              Shipment information unavailable
            </Text>

          </View>
        </View>
      </ScreenWrapper>
    );
  }

  const product = order.products?.[0];

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

          <Text style={styles.headerTitle}>Track Order</Text>

          <View style={{ width: 24 }} />
        </View>

        {product && (
          <View style={styles.productCard}>
            <View style={styles.productImageContainer}>
              {product.product?.productImage ? (
                <Image
                  source={{
                    uri:
                      typeof product.product.productImage === "string"
                        ? product.product.productImage
                        : product.product.productImage?.url,
                  }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons name="image-outline" size={34} color={Colors.gray} />
              )}
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {product.product?.name || "Product"}
              </Text>

              <Text style={styles.productMeta}>
                Laptop • Qty: {product.quantity}
              </Text>

              <Text style={styles.productPrice}>₹{product.price}</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Order Details</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="car-outline" size={19} color={Colors.primary} />
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Expected Delivery Date</Text>

              <Text style={styles.detailValue}>
                {formatDate(shipment.estimatedDelivery)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="receipt-outline"
                size={19}
                color={Colors.primary}
              />
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Order ID</Text>

              <Text style={styles.detailValue}>{order.orderNumber}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Order Status</Text>

        <View style={styles.statusCard}>
          {shipmentSteps.map((step, index) => {
            const state = getStepState(step);
            const timeline = getTimelineEntry(step);
            const isLast = index === shipmentSteps.length - 1;

            return (
              <View key={step} style={styles.timelineRow}>
                <View style={styles.timelineIndicator}>
                  <View
                    style={[
                      styles.statusCircle,
                      state === "completed" && styles.completedCircle,
                      state === "current" && styles.currentCircle,
                    ]}
                  >
                    {state === "completed" || state === "current" ? (
                      <Ionicons
                        name="checkmark"
                        size={13}
                        color={Colors.white}
                      />
                    ) : (
                      <View style={styles.emptyDot} />
                    )}
                  </View>

                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        state === "completed" && styles.completedLine,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      state === "upcoming" && styles.upcomingTitle,
                    ]}
                  >
                    {step}
                  </Text>

                  {timeline && (
                    <>
                      <Text style={styles.timelineMessage}>
                        {timeline.message}
                      </Text>

                      <Text style={styles.timelineDate}>
                        {formatTimelineDate(timeline.timestamp)}

                        {timeline.location ? ` | ${timeline.location}` : ""}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.courierCard}>
          <View style={styles.courierIcon}>
            <Ionicons name="cube-outline" size={21} color={Colors.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.courierLabel}>Courier</Text>

            <Text style={styles.courierName}>{shipment.courier}</Text>

            <Text style={styles.trackingId}>
              Tracking ID: {shipment.trackingId}
            </Text>
          </View>
        </View>

        {shipment.trackingUrl && (
          <TouchableOpacity
            style={styles.trackButton}
            activeOpacity={0.8}
            onPress={() => {
              console.log("Tracking URL:", shipment.trackingUrl);
            }}
          >
            <Text style={styles.trackButtonText}>Track Live Location</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default TrackOrderScreen;

const styles = StyleSheet.create({container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: 10,
    flexDirection: "row",
    marginBottom: 20,
  },

  productImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  productImage: {
    width: "90%",
    height: "90%",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  productName: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },

  productMeta: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  productPrice: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 9,
  },

  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 14,
    marginBottom: 20,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  detailContent: {
    flex: 1,
  },

  detailTitle: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  detailValue: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
  },

  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: 16,
    marginBottom: 15,
  },

  timelineRow: {
    flexDirection: "row",
    minHeight: 68,
  },

  timelineIndicator: {
    width: 25,
    alignItems: "center",
  },

  statusCircle: {
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: "#DCDCDC",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  completedCircle: {
    backgroundColor: Colors.primary,
  },

  currentCircle: {
    backgroundColor: Colors.primary,
  },

  emptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#DCDCDC",
  },

  completedLine: {
    backgroundColor: Colors.primary,
  },

  timelineContent: {
    flex: 1,
    marginLeft: 10,
    paddingBottom: 14,
  },

  timelineTitle: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  upcomingTitle: {
    color: Colors.gray,
  },

  timelineMessage: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    marginTop: 3,
  },

  timelineDate: {
    fontSize: 9,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    marginTop: 3,
  },

  courierCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  courierIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  courierLabel: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  courierName: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginTop: 2,
  },

  trackingId: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    marginTop: 3,
  },

  trackButton: {
    height: 52,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  trackButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.bold,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginTop: 15,
  },

  emptyText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
