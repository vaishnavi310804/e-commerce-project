import React from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  onPress?: () => void;
};

const SearchBar = ({
  value,
  onChangeText,
  onFilterPress,
  onPress,
}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.searchContainer}
        onPress={onPress}
      >
        <Ionicons
          name="search"
          size={20}
          color={Colors.gray}
        />

        <TextInput
          placeholder="Search products..."
          placeholderTextColor={Colors.gray}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
      </Pressable>

      <Pressable
        style={styles.filterButton}
        onPress={onFilterPress}
      >
        <Ionicons
          name="options-outline"
          size={20}
          color={Colors.primary}
        />
      </Pressable>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -20,
    paddingHorizontal: 20,
  },

  searchContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    height: 45,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.black,
  },

  filterButton: {
    width: 45,
    height: 45,
    marginLeft: 12,
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 4,
  },
});