import { View, Text, Pressable } from "react-native";

const SectionHeader = ({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) => {
  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>

      <Pressable onPress={onSeeAll}>
        <Text
          style={{
            color: "#6C63FF",
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          See All
        </Text>
      </Pressable>
    </View>
  );
};
export default SectionHeader;