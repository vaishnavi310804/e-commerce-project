import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { Address } from "@/src/api/address.api";

type ShippingAddressCardProps = {
  address?: Address | null;
  onPress?: () => void;
};

const ShippingAddressCard: React.FC<ShippingAddressCardProps> = ({
  address,
  onPress,
}) => {
  const getFormattedAddress = () => {
    if (!address) return "";

    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state
        ? `${address.state} ${address.postalCode || ""}`
        : address.postalCode,
      address.country,
    ].filter(Boolean);

    return parts.join(", ");
  };

  const getEstimatedArrival = () => {
    const today = new Date();
    const arrivalDate = new Date(today.setDate(today.getDate() + 5));
    const day = arrivalDate.getDate();
    const month = arrivalDate.toLocaleString("en-US", { month: "long" });
    const year = arrivalDate.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const hasAddress = Boolean(address && (address.addressLine1 || address.city));

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Shipping Address</Text>

      {hasAddress ? (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={onPress}
        >
          <View style={styles.leftIconContainer}>
            <Ionicons name="location" size={24} color={Colors.primary} />
          </View>

          <View style={styles.addressInfo}>
            <View style={styles.topRow}>
              <Text style={styles.addressType}>
                {address?.addressType || "Home"}
              </Text>

              <TouchableOpacity style={styles.changeBadge} onPress={onPress}>
                <Text style={styles.changeText}>CHANGE</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.addressText} numberOfLines={2}>
              {getFormattedAddress()}
            </Text>

            <View style={styles.arrivalRow}>
              <Ionicons name="time-outline" size={15} color="#64748B" />
              <Text style={styles.arrivalText}>
                Estimated Arrival {getEstimatedArrival()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.card, styles.emptyCard]}
          activeOpacity={0.8}
          onPress={onPress}
        >
          <View style={styles.leftIconContainer}>
            <Ionicons
              name="add-circle-outline"
              size={26}
              color={Colors.primary}
            />
          </View>

          <View style={styles.addressInfo}>
            <View style={styles.topRow}>
              <Text style={styles.addressType}>No Address Saved</Text>

              <TouchableOpacity style={styles.addBadge} onPress={onPress}>
                <Text style={styles.addText}>+ ADD</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.addressText}>
              Tap to add a shipping address for delivery
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ShippingAddressCard;

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  emptyCard: {
    borderStyle: "dashed",
    borderColor: Colors.primary,
    backgroundColor: "#FBF9FF",
  },

  leftIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  addressInfo: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  addressType: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  changeBadge: {
    backgroundColor: "#F3F0FF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  changeText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },

  addBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  addText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: Colors.white,
    letterSpacing: 0.5,
  },

  addressText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 8,
  },

  arrivalRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  arrivalText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: "#64748B",
    marginLeft: 5,
  },
});
