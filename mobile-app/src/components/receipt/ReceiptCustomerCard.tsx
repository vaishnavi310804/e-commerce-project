import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Address = {
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Props = {
  address: Address;
};

const ReceiptCustomerCard = ({ address }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Customer Details</Text>

      <View style={styles.row}>
        <Ionicons
          name="person-outline"
          size={18}
          color={Colors.primary}
        />

        <Text style={styles.value}>
          {address.fullName}
        </Text>
      </View>

      <View style={styles.row}>
        <Ionicons
          name="call-outline"
          size={18}
          color={Colors.primary}
        />

        <Text style={styles.value}>
          {address.phoneNumber}
        </Text>
      </View>

      <View style={styles.row}>
        <Ionicons
          name="location-outline"
          size={18}
          color={Colors.primary}
        />

        <Text style={styles.address}>
          {address.streetAddress}
          {"\n"}
          {address.city}, {address.state}
          {"\n"}
          {address.postalCode}, {address.country}
        </Text>
      </View>
    </View>
  );
};

export default ReceiptCustomerCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  value: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },

  address: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
});