import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import { router } from "expo-router";
import AddressInput from "@/src/components/address/AddressInput";
import AddressType from "@/src/components/address/AddressType";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { addAddress, CreateAddressPayload } from "@/src/api/address.api";
import { AxiosError } from "axios";

const AddAddressScreen = () => {
  const [form, setForm] = useState<CreateAddressPayload>({
    fullName: "",
    phoneNumber: "",
    addressType: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!form.fullName.trim()) {
      Alert.alert("Validation Error", "Full name is required.");
      return false;
    }
    if (!form.phoneNumber.trim()) {
      Alert.alert("Validation Error", "Phone number is required.");
      return false;
    }
    if (form.phoneNumber.trim().length < 7) {
      Alert.alert("Validation Error", "Please enter a valid phone number.");
      return false;
    }
    if (!form.addressLine1.trim()) {
      Alert.alert("Validation Error", "Address Line 1 is required.");
      return false;
    }
    if (!form.city.trim()) {
      Alert.alert("Validation Error", "City is required.");
      return false;
    }
    if (!form.state.trim()) {
      Alert.alert("Validation Error", "State is required.");
      return false;
    }
    if (!form.postalCode.trim()) {
      Alert.alert("Validation Error", "Postal code is required.");
      return false;
    }
    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      console.log("SENDING ADDRESS PAYLOAD:", form);

      const response = await addAddress(form);
      console.log("SAVE ADDRESS SUCCESS RESPONSE:", response);

      Alert.alert("Success", "Address added successfully!");
      router.back();
    } catch (error: any) {
      console.error("SAVE ADDRESS FAILURE ERROR:", error?.response?.data || error?.message);

      const serverErrors = error?.response?.data?.errors;
      const validationErrorMsg = Array.isArray(serverErrors) && serverErrors.length > 0
        ? serverErrors[0].msg
        : null;

      const errorMessage =
        validationErrorMsg ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save address.";

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add Address</Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <AddressInput
            label="Full Name"
            placeholder="Enter full name"
            value={form.fullName}
            onChangeText={(text) => setForm({ ...form, fullName: text })}
          />

          <AddressInput
            label="Phone Number"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={form.phoneNumber}
            onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
          />

          <Text style={styles.label}>Address Type</Text>

          <AddressType
            value={form.addressType}
            onChange={(type) => setForm({ ...form, addressType: type as any })}
          />

          <AddressInput
            label="Address Line 1"
            placeholder="House / Flat / Building"
            value={form.addressLine1}
            onChangeText={(text) => setForm({ ...form, addressLine1: text })}
          />

          <AddressInput
            label="Address Line 2"
            placeholder="Area / Landmark"
            value={form.addressLine2??""}
            onChangeText={(text) => setForm({ ...form, addressLine2: text })}
          />

          <AddressInput
            label="City"
            placeholder="Enter city"
            value={form.city}
            onChangeText={(text) => setForm({ ...form, city: text })}
          />

          <AddressInput
            label="State"
            placeholder="Enter state"
            value={form.state}
            onChangeText={(text) => setForm({ ...form, state: text })}
          />

          <AddressInput
            label="Postal Code"
            placeholder="Enter postal code"
            keyboardType="number-pad"
            value={form.postalCode}
            onChangeText={(text) => setForm({ ...form, postalCode: text })}
          />

          <AddressInput
            label="Country"
            placeholder="Enter country"
            value={form.country}
            onChangeText={(text) => setForm({ ...form, country: text })}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Set as Default Address</Text>

            <Switch
              value={form.isDefault}
              onValueChange={(value) => setForm({ ...form, isDefault: value })}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.7 }]}
            onPress={handleSaveAddress}
            disabled={loading}
          >
            <Text style={styles.saveText}>
              {loading ? "Saving..." : "Save Address"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  label: {
    fontFamily: Fonts.semibold,
    fontSize: 15,
    marginBottom: 10,
    color: Colors.text,
  },

  switchRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  switchText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: Colors.text,
  },

  saveButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#FFF",
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
});
