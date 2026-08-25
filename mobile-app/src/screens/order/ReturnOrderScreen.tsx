import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { getMyOrderDetails, OrderData } from "@/src/api/order.api";
import { CreateReturnPayload, createReturn } from "@/src/api/return.api";

const RETURN_REASONS = [
  "Product is damaged",
  "Product is defective",
  "Wrong product received",
  "Product does not match description",
  "Product is not as expected",
  "Size or fit issue",
  "Changed my mind",
  "Other",
];

interface SelectedItem {
  product: string;
  quantity: number;
}

const ReturnOrderScreen = () => {
  const { orderId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);

  const [selectedItems, setSelectedItems] = useState<
    Record<string, SelectedItem>
  >({});

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [showReasons, setShowReasons] = useState(false);

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
      Alert.alert("Error", "Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const toggleProduct = (productId: string, quantity: number) => {
    setSelectedItems((previous) => {
      const updated = { ...previous };

      if (updated[productId]) {
        delete updated[productId];
      } else {
        updated[productId] = {
          product: productId,
          quantity: 1,
        };
      }

      return updated;
    });
  };

  const increaseQuantity = (productId: string, maxQuantity: number) => {
    setSelectedItems((previous) => {
      const item = previous[productId];

      if (!item) return previous;

      if (item.quantity >= maxQuantity) {
        return previous;
      }

      return {
        ...previous,
        [productId]: {
          ...item,
          quantity: item.quantity + 1,
        },
      };
    });
  };

  const decreaseQuantity = (productId: string) => {
    setSelectedItems((previous) => {
      const item = previous[productId];

      if (!item) return previous;

      if (item.quantity <= 1) {
        return previous;
      }

      return {
        ...previous,
        [productId]: {
          ...item,
          quantity: item.quantity - 1,
        },
      };
    });
  };

  const handleSubmit = async () => {
    const items = Object.values(selectedItems);

    if (items.length === 0) {
      Alert.alert(
        "Select Product",
        "Please select at least one product to return.",
      );
      return;
    }

    if (!reason) {
      Alert.alert("Return Reason", "Please select a reason for the return.");
      return;
    }

    const isCodOrder = order?.paymentMethod === "COD";

    if (isCodOrder) {
      if (refundMode === "UPI") {
        if (!upiId.trim()) {
          Alert.alert(
            "Refund Details Required",
            "Please enter a valid UPI ID for your refund.",
          );
          return;
        }
      } else {
        if (
          !accountHolderName.trim() ||
          !accountNumber.trim() ||
          !ifscCode.trim() ||
          !bankName.trim()
        ) {
          Alert.alert(
            "Refund Details Required",
            "Please provide complete bank account details (Account Holder Name, Account Number, IFSC Code, and Bank Name) for your refund.",
          );
          return;
        }
      }
    }

    setSubmitting(true);

    try {
      const payload: CreateReturnPayload = {
        orderId: orderId as string,
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          reason,
        })),
        reason,
        description: description.trim(),
        returnType: "REFUND",
      };

      if (isCodOrder) {
        if (refundMode === "UPI") {
          payload.bankDetails = {
            upiId: upiId.trim(),
          };
        } else {
          payload.bankDetails = {
            accountHolderName: accountHolderName.trim(),
            accountNumber: accountNumber.trim(),
            ifscCode: ifscCode.trim(),
            bankName: bankName.trim(),
          };
        }
      }

      const response = await createReturn(payload);

      if (response.success) {
        Alert.alert(
          "Return Requested",
          "Your return request has been submitted successfully.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ],
        );
      }
    } catch (error: any) {
      console.log(
        "Return Request Error:",
        error?.response?.data || error?.message,
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit return request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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

          <Text style={styles.title}>Return Order</Text>

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

          <Text style={styles.title}>Return Order</Text>

          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.heading}>Select items to return</Text>

        <Text style={styles.subHeading}>
          Select the products you want to return with a valid reason.
        </Text>

        <View style={styles.productsContainer}>
          {productsList.map((item, index) => {
            const productId = item.product?._id;

            if (!productId) return null;

            const alreadyRequested = item.returnStatus !== "Not Requested";

            const selected = !!selectedItems[productId];

            return (
              <View
                key={productId || index.toString()}
                style={[
                  styles.productCard,
                  selected && styles.selectedCard,
                  alreadyRequested && styles.disabledCard,
                ]}
              >
                <TouchableOpacity
                  disabled={alreadyRequested}
                  activeOpacity={0.8}
                  onPress={() => toggleProduct(productId, item.quantity)}
                  style={styles.productTop}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selected && styles.checkboxSelected,
                    ]}
                  >
                    {selected && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={Colors.white}
                      />
                    )}
                  </View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.product.name}
                    </Text>

                    <Text style={styles.productPrice}>₹{item.price}</Text>

                    <Text style={styles.availableQuantity}>
                      Ordered quantity: {item.quantity}
                    </Text>
                  </View>
                </TouchableOpacity>

                {alreadyRequested ? (
                  <View style={styles.alreadyReturned}>
                    <Text style={styles.alreadyReturnedText}>
                      Return already requested
                    </Text>
                  </View>
                ) : (
                  selected && (
                    <View style={styles.quantityRow}>
                      <Text style={styles.quantityLabel}>Return quantity</Text>

                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => decreaseQuantity(productId)}
                        >
                          <Ionicons
                            name="remove"
                            size={18}
                            color={Colors.text}
                          />
                        </TouchableOpacity>

                        <Text style={styles.quantity}>
                          {selectedItems[productId]?.quantity || 1}
                        </Text>

                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() =>
                            increaseQuantity(productId, item.quantity)
                          }
                        >
                          <Ionicons name="add" size={18} color={Colors.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Return reason</Text>

          <TouchableOpacity
            style={styles.dropdown}
            activeOpacity={0.8}
            onPress={() => setShowReasons((previous) => !previous)}
          >
            <Text style={[styles.dropdownText, !reason && styles.placeholder]}>
              {reason || "Select a reason"}
            </Text>

            <Ionicons
              name={showReasons ? "chevron-up" : "chevron-down"}
              size={20}
              color={Colors.gray}
            />
          </TouchableOpacity>

          {showReasons && (
            <View style={styles.reasonList}>
              {RETURN_REASONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.reasonOption}
                  onPress={() => {
                    setReason(item);
                    setShowReasons(false);
                  }}
                >
                  <Text style={styles.reasonText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Additional details</Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us more about the reason for your return..."
            placeholderTextColor={Colors.gray}
            multiline
            textAlignVertical="top"
            style={styles.descriptionInput}
          />
        </View>

        {order?.paymentMethod === "COD" && (
          <View style={styles.section}>
            <Text style={styles.label}>Refund Details</Text>

            <Text style={styles.infoText}>
              For COD orders, your refund will be transferred to the account/UPI
              details provided below.
            </Text>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabButton,
                  refundMode === "UPI" && styles.tabButtonActive,
                ]}
                onPress={() => setRefundMode("UPI")}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={16}
                  color={refundMode === "UPI" ? Colors.white : Colors.text}
                  style={{ marginRight: 6 }}
                />

                <Text
                  style={[
                    styles.tabText,
                    refundMode === "UPI" && styles.tabTextActive,
                  ]}
                >
                  UPI ID
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.tabButton,
                  refundMode === "BANK" && styles.tabButtonActive,
                ]}
                onPress={() => setRefundMode("BANK")}
              >
                <Ionicons
                  name="card-outline"
                  size={16}
                  color={refundMode === "BANK" ? Colors.white : Colors.text}
                  style={{ marginRight: 6 }}
                />

                <Text
                  style={[
                    styles.tabText,
                    refundMode === "BANK" && styles.tabTextActive,
                  ]}
                >
                  Bank Account
                </Text>
              </TouchableOpacity>
            </View>

            {refundMode === "UPI" ? (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>UPI ID *</Text>

                <TextInput
                  value={upiId}
                  onChangeText={setUpiId}
                  placeholder="Enter your UPI ID (customer@upi)"
                  placeholderTextColor={Colors.gray}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.textInput}
                />
              </View>
            ) : (
              <View style={styles.bankFormGroup}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Account Holder Name *</Text>

                  <TextInput
                    value={accountHolderName}
                    onChangeText={setAccountHolderName}
                    placeholder="Enter full name as per bank"
                    placeholderTextColor={Colors.gray}
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Account Number</Text>

                  <TextInput
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    placeholder="Enter your bank account number"
                    placeholderTextColor={Colors.gray}
                    keyboardType="number-pad"
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>IFSC Code</Text>

                  <TextInput
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    placeholder="SBIN0001234"
                    placeholderTextColor={Colors.gray}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bank Name</Text>

                  <TextInput
                    value={bankName}
                    onChangeText={setBankName}
                    placeholder="Enter bank name"
                    placeholderTextColor={Colors.gray}
                    style={styles.textInput}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          disabled={submitting}
          activeOpacity={0.8}
          style={[styles.submitButton, submitting && styles.disabledButton]}
          onPress={handleSubmit}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitText}>Request Return</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ReturnOrderScreen;

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

  heading: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 6,
  },

  subHeading: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    lineHeight: 20,
    marginBottom: 20,
  },

  productsContainer: {
    marginBottom: 20,
  },

  productCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  selectedCard: {
    borderColor: Colors.primary,
  },

  disabledCard: {
    opacity: 0.65,
  },

  productTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Colors.gray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 5,
  },

  productPrice: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 4,
  },

  availableQuantity: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  alreadyReturned: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  alreadyReturnedText: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
    color: Colors.gray,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  quantityLabel: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },

  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },

  quantity: {
    width: 40,
    textAlign: "center",
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  section: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 9,
  },

  dropdown: {
    minHeight: 52,
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  placeholder: {
    color: Colors.gray,
  },

  reasonList: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },

  reasonOption: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  reasonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  descriptionInput: {
    minHeight: 120,
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 15,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  infoText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    lineHeight: 18,
    marginBottom: 14,
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },

  tabButton: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  tabButtonActive: {
    backgroundColor: Colors.primary,
  },

  tabText: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  tabTextActive: {
    color: Colors.white,
  },

  inputGroup: {
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 6,
  },

  bankFormGroup: {
    marginTop: 2,
  },

  textInput: {
    height: 48,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  submitButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.7,
  },

  submitText: {
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
});
