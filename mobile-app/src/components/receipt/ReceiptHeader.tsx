import React from "react";
import { StyleSheet, Text,  TouchableOpacity, View} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type Props = {
  onShare?: () => void;
};

const ReceiptHeader = ({ onShare }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        activeOpacity={0.8}
        onPress={() => router.back()}
      >
        <Ionicons
          name="chevron-back"
          size={22}
          color={Colors.text}
        />
      </TouchableOpacity>

      <Text style={styles.title}>
        E-Receipt
      </Text>

      <TouchableOpacity
        style={styles.iconButton}
        activeOpacity={0.8}
        onPress={onShare}
      >
        <Ionicons
          name="share-social-outline"
          size={20}
          color={Colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ReceiptHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  title: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
});