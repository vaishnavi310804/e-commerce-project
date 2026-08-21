import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { createTicket } from "@/src/api/ticket.api";
import { getMyOrders } from "@/src/api/order.api";

const categories = [
  "Shipment Delay",
  "Delivery Issue",
  "Refund Delay",
  "Payment Issue",
  "Return Issue",
  "Order Issue",
  "Product Issue",
  "Cancellation Issue",
  "Other",
];

const RaiseTicketScreen = () => {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [showCategories, setShowCategories] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getMyOrders();

      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.log("Fetch Orders Error:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSubmit = async () => {
    if (!category) {
      Alert.alert("Missing Category", "Please select a ticket category.");
      return;
    }

    if (!subject.trim()) {
      Alert.alert("Missing Subject", "Please enter a subject.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Missing Description", "Please describe your issue.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createTicket({
        category: category as any,
        orderId: selectedOrder?._id,
        subject: subject.trim(),
        description: description.trim(),
      });

      if (response.success) {
        Alert.alert(
          "Ticket Raised",
          `Your ticket ${response.data.ticketNumber} has been created successfully.`,
          [
            {
              text: "OK",
              onPress: () => router.replace("/ticket-details"),
            },
          ],
        );
      } else {
        Alert.alert(
          "Failed to Raise Ticket",
          response.message || "Something went wrong.",
        );
      }
    } catch (error: any) {
      console.log(
        "Create Ticket Error:",
        error?.response?.data || error?.message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={Colors.text}
              />
            </TouchableOpacity>

            <Text style={styles.title}>Raise a Ticket</Text>

            <View style={styles.headerPlaceholder} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.intro}>
              Let us the issue you are facing!!
            </Text>

            <Text style={styles.label}>Category</Text>

            <TouchableOpacity
              style={styles.selector}
              activeOpacity={0.8}
              onPress={() => {
                setShowCategories(!showCategories);
                setShowOrders(false);
              }}
            >
              <Text
                style={[
                  styles.selectorText,
                  !category && styles.placeholder,
                ]}
              >
                {category || "Select a category"}
              </Text>

              <Ionicons
                name={showCategories ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.gray}
              />
            </TouchableOpacity>

            {showCategories && (
              <View style={styles.dropdown}>
                {categories.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCategory(item);
                      setShowCategories(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>

                    {category === item && (
                      <Ionicons
                        name="checkmark"
                        size={19}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={[styles.label, styles.orderLabel]}>
              Related Order
            </Text>

            <TouchableOpacity
              style={styles.selector}
              activeOpacity={0.8}
              onPress={() => {
                setShowOrders(!showOrders);
                setShowCategories(false);
              }}
            >
              {loadingOrders ? (
                <ActivityIndicator
                  size="small"
                  color={Colors.primary}
                />
              ) : (
                <Text
                  style={[
                    styles.selectorText,
                    !selectedOrder && styles.placeholder,
                  ]}
                >
                  {selectedOrder
                    ? `Order #${selectedOrder.orderNumber}`
                    : "Select an order (optional)"}
                </Text>
              )}

              <Ionicons
                name={showOrders ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.gray}
              />
            </TouchableOpacity>

            {showOrders && !loadingOrders && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedOrder(null);
                    setShowOrders(false);
                  }}
                >
                  <Text style={styles.dropdownText}>
                    No specific order
                  </Text>

                  {!selectedOrder && (
                    <Ionicons
                      name="checkmark"
                      size={19}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>

                {orders.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedOrder(item);
                      setShowOrders(false);
                    }}
                  >
                    <View style={styles.orderOption}>
                      <Text style={styles.dropdownText}>
                        #{item.orderNumber}
                      </Text>

                      <Text style={styles.orderStatus}>
                        {item.orderStatus}
                      </Text>
                    </View>

                    {selectedOrder?._id === item._id && (
                      <Ionicons
                        name="checkmark"
                        size={19}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={[styles.label, styles.fieldLabel]}>
              Subject
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. My shipment is delayed"
              placeholderTextColor="#A0A0A0"
              value={subject}
              onChangeText={setSubject}
              maxLength={150}
            />

            <Text style={styles.characterCount}>
              {subject.length}/150
            </Text>

            <Text style={[styles.label, styles.fieldLabel]}>
              Describe your issue
            </Text>

            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Explain the issue you're facing..."
              placeholderTextColor="#A0A0A0"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                submitting && styles.disabledButton,
              ]}
              activeOpacity={0.85}
              disabled={submitting}
              onPress={handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.submitText}>
                    Submit Ticket
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default RaiseTicketScreen;

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  headerPlaceholder: {
    width: 42,
  },

  title: {
    fontSize: 21,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  intro: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.gray,
    fontFamily: Fonts.regular,
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 8,
  },

  orderLabel: {
    marginTop: 20,
  },

  fieldLabel: {
    marginTop: 20,
  },

  selector: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  placeholder: {
    color: "#A0A0A0",
  },

  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },

  dropdownItem: {
    minHeight: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  dropdownText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  orderOption: {
    flex: 1,
  },

  orderStatus: {
    marginTop: 3,
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.gray,
  },

  input: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  characterCount: {
    textAlign: "right",
    marginTop: 5,
    fontSize: 11,
    color: Colors.gray,
    fontFamily: Fonts.regular,
  },

  descriptionInput: {
    height: 150,
    paddingTop: 15,
    paddingBottom: 15,
  },

  submitButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    marginTop: 30,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.7,
  },

  submitText: {
    marginLeft: 8,
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});