import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import LottieView from "lottie-react-native";

const Success = () => {
  return (
    <View>
      {/* <Ionicons name="checkmark" size={42} color="#FFF" /> */}
      <LottieView
        source={require("../../../assets/animation/payment-success.json")}
        autoPlay
        loop={false}
        style={{
          width: 220,
          height: 220,
        }}
      />
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({});
