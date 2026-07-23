import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "@/src/constants/colors";

type Props = {
  title: string;
  onSeeAll?: () => void;
};

const SectionHeader = ({
  title,
  onSeeAll,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text style={styles.seeAll}>
            See All
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  seeAll: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
});