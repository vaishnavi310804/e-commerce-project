import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  image?: "paypal" | "apple" | "google";
  selected?: boolean;
  disabled?: boolean;
  arrow?: boolean;
  onPress: () => void;
};

const PaymentOption = ({
  title,
  icon,
  selected,
  disabled,
  arrow,
  onPress,
}: Props) => {
  const handlePress = () => {
    if (disabled) {
      Alert.alert("Coming Soon");
      return;
    }

    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={styles.container}
    >
      <View style={styles.left}>
        {icon && (
          <Ionicons
            name={icon}
            size={22}
            color={Colors.primary}
          />
        )}

        <Text style={styles.title}>{title}</Text>
      </View>

      {arrow ? (
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#777"
        />
      ) : (
        <View
          style={[
            styles.radio,
            selected && styles.radioSelected,
          ]}
        >
          {selected && <View style={styles.dot} />}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PaymentOption;

const styles = StyleSheet.create({
  container: {
    height: 58,
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginTop: 10,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    marginLeft: 12,
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: Colors.text,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#CFCFCF",
    justifyContent: "center",
    alignItems: "center",
  },

  radioSelected: {
    borderColor: Colors.primary,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});