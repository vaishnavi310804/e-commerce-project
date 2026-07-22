import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/src/constants/colors";

type Props = {
  image: string | null;
  onChange: (image: string | null) => void;
};

export default function Avatar({
  image,
  onChange,
}: Props) {
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Ionicons
            name="person-outline"
            size={60}
            color={Colors.primary}
          />
        )}

        <Pressable style={styles.editButton} onPress={pickImage}>
          <Ionicons
            name="create-outline"
            size={18}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 30,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },

  editButton: {
    position: "absolute",
    bottom: 6,
    right: 6,

    width: 36,
    height: 36,
    borderRadius: 18,

    backgroundColor: Colors.primary,

    justifyContent: "center",
    alignItems: "center",
  },
});