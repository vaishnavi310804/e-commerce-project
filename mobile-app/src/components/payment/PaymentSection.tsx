import React from "react";
import { StyleSheet, Text, View } from "react-native";

import PaymentOption from "./PaymentOption";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { Ionicons } from "@expo/vector-icons";

export type PaymentOptionType = {
  id: string;
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  image?: "paypal" | "apple" | "google";
  disabled?: boolean;
  arrow?: boolean;
};

type Props = {
  title: string;
  options: PaymentOptionType[];
  selected: string;
  onSelect: (id: string) => void;
};

const PaymentSection = ({
  title,
  options,
  selected,
  onSelect,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {options.map((item) => (
        <PaymentOption
          key={item.id}
          title={item.title}
          icon={item.icon}
          image={item.image}
          disabled={item.disabled}
          arrow={item.arrow}
          selected={selected === item.id}
          onPress={() => onSelect(item.id)}
        />
      ))}
    </View>
  );
};

export default PaymentSection;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  title: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 8,
  },
});