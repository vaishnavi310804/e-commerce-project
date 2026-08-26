import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { getMyReturns, ReturnData } from "@/src/api/return.api";
import ShippingDetailsCard from "@/src/components/order/ShippingDetailsCard";
import PaymentDetailsCard from "@/src/components/payment/PaymentDetailsCard";
import PriceSummaryCard from "@/src/components/payment/PriceSummaryCard";
import RefundDetailsCard from "@/src/components/payment/RefundDetailsCard";

const OrderDetailsScreen = () => {
  const { orderId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnInfo, setReturnInfo] = useState<ReturnData | null>(null);

  // COD Replacement Cancellation Modal State
  const [showCodCancelModal, setShowCodCancelModal] = useState(false);
  const [refundMode, setRefundMode] = useState<"UPI" | "BANK">("UPI");
  const [upiId, setUpiId] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

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

  useEffect(() => {
    const fetchReturnInfo = async () => {
      try {
        if (!orderId) return;
        const response = await getMyReturns();
        if (response.success && response.data) {
          const match = response.data.find(
            (r) =>
              (typeof r.order === "string" ? r.order : r.order?._id) ===
              orderId,
          );
          if (match) {
            setReturnInfo(match);
          }
        }
      } catch (error) {
        console.log("Fetch Return Info Error:", error);
      }
    };

    fetchReturnInfo();
  }, [orderId]);

  const executeCancellation = async (payload?: { bankDetails?: any }) => {
    if (!order?._id) return;
    setCancelLoading(true);
    try {
      const response = await cancelOrder(order._id, payload);
      if (response.success) {
        setShowCodCancelModal(false);
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
  };

  const handleCancel = () => {
    const isReplacement = Boolean(order?.originalOrder);
    const rootPaymentMethod =
      order?.originalOrder?.paymentMethod ||
      (order?.paymentMethod === "COD" && isReplacement ? "COD" : order?.paymentMethod || "COD");

    if (isReplacement && rootPaymentMethod === "COD") {
      // Show COD refund destination form before cancellation
      setShowCodCancelModal(true);
      return;
    }

    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => executeCancellation(),
      },
    ]);
  };

  const handleCodCancelSubmit = () => {
    let bankDetails: any = {};
    if (refundMode === "UPI") {
      if (!upiId.trim()) {
        Alert.alert("Error", "Please enter a valid UPI ID.");
        return;
      }
      bankDetails = { upiId: upiId.trim() };
    } else {
      if (
        !accountHolderName.trim() ||
        !accountNumber.trim() ||
        !ifscCode.trim() ||
        !bankName.trim()
      ) {
        Alert.alert("Error", "Please fill in all bank details.");
        return;
      }
      bankDetails = {
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        bankName: bankName.trim(),
      };
    }

    executeCancellation({ bankDetails });
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
            router.push(`/track-order/${order._id}`);
          },
        };

      case "Delivered":
        return {
          title: "Return / Exchange Order",
          onPress: () => {
            setShowReturnModal(true);
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

  const getReturnStatusText = () => {
    if (returnInfo?.returnType === "REPLACEMENT") {
      if (returnInfo.replacementOrder) {
        return "Replacement Order Created";
      }
      if (returnInfo.status === "Approved") return "Exchange Approved";
      if (returnInfo.status === "Picked Up") return "Exchange Picked Up";
      if (returnInfo.status === "Completed") return "Exchange Completed";
      if (returnInfo.status === "Rejected") return "Exchange Rejected";
      return "Exchange Initiated";
    }

    const returnStatuses = productsList
      .map((item) => item.returnStatus)
      .filter((status) => status && status !== "Not Requested");

    if (returnStatuses.length === 0) {
      return null;
    }

    if (returnStatuses.includes("Requested")) {
      return "Return Initiated";
    }

    if (returnStatuses.includes("Approved")) {
      return "Return Approved";
    }

    if (returnStatuses.includes("Picked Up")) {
      return "Return Picked Up";
    }

    if (returnStatuses.includes("Refunded")) {
      return "Refund Completed";
    }

    if (returnStatuses.includes("Rejected")) {
      return "Return Rejected";
    }

    return null;
  };

  const returnStatusText = getReturnStatusText();

  const replacementOrderObj =
    returnInfo && typeof returnInfo.replacementOrder === "object"
      ? returnInfo.replacementOrder
      : null;

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

          {returnStatusText && (
            <View style={styles.returnStatusBadge}>

              <Text style={styles.returnStatusText}>{returnStatusText}</Text>
            </View>
          )}

          <Text style={styles.date}>
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>

        {replacementOrderObj && (
          <View style={styles.replacementCard}>
            <Ionicons name="swap-horizontal" size={24} color={Colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.replacementTitle}>
                Replacement Order Created
              </Text>
              <Text style={styles.replacementSub}>
                Order #{replacementOrderObj.orderNumber}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewReplacementBtn}
              onPress={() =>
                router.push({
                  pathname: "/order-details",
                  params: { orderId: replacementOrderObj._id },
                })
              }
            >
              <Text style={styles.viewReplacementText}>View</Text>
            </TouchableOpacity>
          </View>
        )}

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

        {order.refundStatus !== "Not Applicable" && (
            <RefundDetailsCard
              refundStatus={order.refundStatus}
              refundAmount={order.refundAmount}
              refundDate={order.refundDate}
            />
          )}

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

      <Modal
        visible={showReturnModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReturnModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>What would you like to do?</Text>

              <TouchableOpacity
                onPress={() => setShowReturnModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.optionCard}
              activeOpacity={0.8}
              onPress={() => {
                setShowReturnModal(false);
                router.push(`/return/${order._id}`);
              }}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons
                  name="wallet-outline"
                  size={24}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Return & Refund</Text>

                <Text style={styles.optionDescription}>
                  Get your money back after returning the item.
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              activeOpacity={0.8}
              onPress={() => {
                setShowReturnModal(false);
                router.push(`/exchange/${order._id}` as any);
              }}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons
                  name="repeat-outline"
                  size={24}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Exchange</Text>

                <Text style={styles.optionDescription}>
                  Return the item and receive a replacement.
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCodCancelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCodCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>COD Refund</Text>
              <TouchableOpacity
                onPress={() => setShowCodCancelModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: Colors.gray, marginBottom: 16, lineHeight: 18 }}>
              As the original order was paid via COD, please enter your UPI or Bank details where the refund will be processed.
            </Text>

            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  alignItems: "center",
                  borderBottomWidth: 2,
                  borderBottomColor: refundMode === "UPI" ? Colors.primary : "transparent",
                }}
                onPress={() => setRefundMode("UPI")}
              >
                <Text style={{ fontFamily: Fonts.bold, color: refundMode === "UPI" ? Colors.primary : Colors.gray }}>
                  UPI
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  alignItems: "center",
                  borderBottomWidth: 2,
                  borderBottomColor: refundMode === "BANK" ? Colors.primary : "transparent",
                }}
                onPress={() => setRefundMode("BANK")}
              >
                <Text style={{ fontFamily: Fonts.bold, color: refundMode === "BANK" ? Colors.primary : Colors.gray }}>
                  Bank Transfer
                </Text>
              </TouchableOpacity>
            </View>

            {refundMode === "UPI" ? (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 12, color: Colors.text, marginBottom: 6, fontFamily: Fonts.semibold }}>UPI ID *</Text>
                <TextInput
                  value={upiId}
                  onChangeText={setUpiId}
                  placeholder="e.g. name@upi"
                  style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, padding: 12, fontSize: 14 }}
                />
              </View>
            ) : (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 12, color: Colors.text, marginBottom: 4, fontFamily: Fonts.semibold }}>Account Holder Name *</Text>
                <TextInput
                  value={accountHolderName}
                  onChangeText={setAccountHolderName}
                  placeholder="Name as per bank account"
                  style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 10 }}
                />
                <Text style={{ fontSize: 12, color: Colors.text, marginBottom: 4, fontFamily: Fonts.semibold }}>Account Number *</Text>
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="Bank Account Number"
                  keyboardType="number-pad"
                  style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 10 }}
                />
                <Text style={{ fontSize: 12, color: Colors.text, marginBottom: 4, fontFamily: Fonts.semibold }}>IFSC Code *</Text>
                <TextInput
                  value={ifscCode}
                  onChangeText={setIfscCode}
                  placeholder="IFSC Code"
                  autoCapitalize="characters"
                  style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 10 }}
                />
                <Text style={{ fontSize: 12, color: Colors.text, marginBottom: 4, fontFamily: Fonts.semibold }}>Bank Name *</Text>
                <TextInput
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="State Bank of India, etc."
                  style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, padding: 10, fontSize: 14 }}
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.actionButton, cancelLoading && styles.disabledButton]}
              disabled={cancelLoading}
              onPress={handleCodCancelSubmit}
            >
              {cancelLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.actionText}>Confirm Cancellation</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  returnStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    padding: 4,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 10,
  },

  returnStatusText: {
    marginLeft: 6,
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: Colors.primary,
  },

  replacementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F5FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  replacementTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  replacementSub: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    marginTop: 2,
  },

  viewReplacementBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  viewReplacementText: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontSize: 13,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  modalCloseBtn: {
    padding: 4,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F0EBFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  optionTextContainer: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 3,
  },

  optionDescription: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },
});
