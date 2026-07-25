import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type ProfileCardProps = {
  name: string;
  email: string;
  image?: string;
  onEditPress?: () => void;
};

const ProfileCard = ({
  name,
  email,
  image,
  onEditPress,
}: ProfileCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {image && !imageError ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="person"
              size={50}
              color={Colors.primary}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
        >
          <Ionicons
            name="create-outline"
            size={16}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 24,
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  placeholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F5F2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,

    width: 34,
    height: 34,
    borderRadius: 17,

    backgroundColor: Colors.primary,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 3,
    borderColor: "#fff",
  },

  name: {
    marginTop: 18,
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  email: {
    marginTop: 6,
    fontSize: 15,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },
});