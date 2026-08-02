import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { ShippingAddress } from "@/src/api/order.api";

type Props = {
  address: ShippingAddress;
};

const ShippingDetailsCard = ({ address }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="location"
            size={18}
            color={Colors.primary}
          />
        </View>

        <View>
          <Text style={styles.title}>Shipping Address</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.name}>
        {address.fullName}
      </Text>

      <Text style={styles.phone}>
        {address.phoneNumber}
      </Text>

      <Text style={styles.address}>
        {address.streetAddress}
      </Text>

      <Text style={styles.address}>
        {address.city}, {address.state} {address.postalCode}
      </Text>

      <Text style={styles.address}>
        {address.country}
      </Text>
    </View>
  );
};

export default ShippingDetailsCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  title: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  divider: {
    height: 1,
    backgroundColor: "#F2F2F2",
    marginVertical: 16,
  },

  name: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },

  phone: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },

  address: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Fonts.medium,
    color: Colors.gray,
  },
});