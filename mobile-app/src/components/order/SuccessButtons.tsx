import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  onViewOrder: () => void;
  onReceipt: () => void;
};

const SuccessActions = ({ onViewOrder, onReceipt }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onViewOrder}>
        <Text style={styles.buttonText}>View Order</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onReceipt}>
        <Text style={styles.receipt}>View E-Receipt</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessActions;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 25,
  },

  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontFamily: Fonts.bold,
    fontSize: 16,
  },

  receipt: {
    marginTop: 18,
    textAlign: "center",
    color: Colors.primary,
    fontFamily: Fonts.semibold,
    fontSize: 15,
  },
});
