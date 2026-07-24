import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Address } from '@/src/api/address.api';
import Fonts from '@/src/constants/fonts';
import Colors from '@/src/constants/colors';
import { Ionicons } from "@expo/vector-icons";

type AddressCardProps = {
  address: Address;
  selected: boolean;
  onPress: () => void;
};
const AddressCard = ({address,
  selected,
  onPress}:AddressCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="location-outline"
            size={18}
            color={Colors.primary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.type}>
            {address.addressType}
          </Text>

          <Text style={styles.address} numberOfLines={2}>
            {address.addressLine1}
            {address.addressLine2
              ? `, ${address.addressLine2}`
              : ""}
            {`, ${address.city}, ${address.state} ${address.postalCode}`}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.radioOuter,
          selected && styles.radioOuterSelected,
        ]}
      >
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  )
}

export default AddressCard

const styles = StyleSheet.create({
     container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  selectedContainer: {
    borderColor: Colors.primary,
  },

  leftSection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F8F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  type: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },

  address: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D8D8D8",
    justifyContent: "center",
    alignItems: "center",
  },

  radioOuterSelected: {
    borderColor: Colors.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
})