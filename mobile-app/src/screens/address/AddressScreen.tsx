import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Fonts from "@/src/constants/fonts";
import Colors from "@/src/constants/colors";
import {
  getAddresses,
  getDefaultAddress,
  Address,
} from "@/src/api/address.api";
import AddressCard from "@/src/components/address/AddressCard";
import AddAddress from "@/app/add-address";

const AddressScreen = () => {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses();
      setAddresses(response.data);

      const defaultAddress =
        response.data.find((address) => address.isDefault) || response.data[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Shipping Address</Text>

        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <AddressCard
            address={item}
            selected={selectedAddressId === item._id}
            onPress={() => setSelectedAddressId(item._id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={70} color={Colors.gray} />

            <Text style={styles.emptyTitle}>No Address Found</Text>

            <Text style={styles.emptySubtitle}>
              Add your first shipping address to continue.
            </Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addAddressButton}
            activeOpacity={0.8}
            onPress={() => router.push("/add-address")}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={Colors.primary}
            />

            <Text style={styles.addAddressText}>Add New Shipping Address</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedAddressId && { opacity: 0.5 },
          ]}
          disabled={!selectedAddressId}
          onPress={() => router.push("/cart")}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default AddressScreen;

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
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  emptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    color: Colors.gray,
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },

  addAddressButton: {
    marginTop: 20,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  addAddressText: {
    marginLeft: 8,
    color: Colors.primary,
    fontSize: 15,
    fontFamily: Fonts.semibold,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },

  continueButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  continueText: {
    color: "#FFF",
    fontFamily: Fonts.bold,
    fontSize: 17,
  },
});
