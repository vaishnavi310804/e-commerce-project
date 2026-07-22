import { Image, Pressable, Text, View } from "react-native";
import { Category } from "@/src/api/category.api";
import Colors from "@/src/constants/colors";

type Props = {
  item: Category;
  onPress: () => void;
};

export default function CategoryItem({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="items-center mr-5">
      <View
        className="w-16 h-16 rounded-full items-center justify-center overflow-hidden"
        style={{
          backgroundColor: "#F6F6F6",
        }}
      >
        {item.image?.url ? (
          <Image
            source={{ uri: item.image.url }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-xl font-bold" style={{ color: Colors.primary }}>
            {item.name.charAt(0)}
          </Text>
        )}
      </View>

      <Text numberOfLines={1} className="mt-2 text-xs text-center w-20">
        {item.name}
      </Text>
    </Pressable>
  );
}
