import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '@/src/constants/colors'
import Fonts from '@/src/constants/fonts'

type PriceDetailsProps={
    subtotal:number;
    discount:number;
    delivery:number;
}

const PriceDetails = ({
    subtotal,
    discount,
    delivery,
}:PriceDetailsProps) => {

    const total=subtotal-discount
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Details</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Discount</Text>
        <Text style={styles.discount}>-₹{discount.toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Delivery</Text>

        {delivery === 0 ? (
          <Text style={styles.free}>FREE</Text>
        ) : (
          <Text style={styles.value}>₹{delivery.toFixed(2)}</Text>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.total}>₹{total.toFixed(2)}</Text>
      </View>
    </View>
  )
}

export default PriceDetails

const styles = StyleSheet.create({
    container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    // marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  label: {
    fontSize: 15,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },

  value: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: Fonts.semibold,
  },

  discount: {
    fontSize: 15,
    color: "#22C55E",
    fontFamily: Fonts.semibold,
  },

  free: {
    fontSize: 15,
    color: "#22C55E",
    fontFamily: Fonts.bold,
  },

  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 17,
    color: Colors.text,
    fontFamily: Fonts.bold,
  },

  total: {
    fontSize: 20,
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },
})