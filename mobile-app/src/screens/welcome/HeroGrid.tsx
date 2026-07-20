import { Image, StyleSheet, View } from "react-native";

const cards = [
  require("../../../assets/products/shoe.png"),
  require("../../../assets/products/watch.png"),
  null,
  require("../../../assets/products/perfume.png"),
  require("../../../assets/products/jacket.png"),
  require("../../../assets/products/phone.png"),
  require("../../../assets/products/brush.png"),
  require("../../../assets/products/headphone.png"),
  null,
];

export default function HeroGrid() {
  return (
    <View style={styles.wrapper}>
      {cards.map((item, index) => (
        <View key={index} style={styles.card}>
          {item && (
            <Image
              source={item}
              resizeMode="contain"
              style={styles.image}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "140%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    transform: [{ rotate: "-8deg" }],
  },

  card: {
    width: "31%",
    aspectRatio: 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    marginBottom: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 6,
  },

  image: {
    width: "82%",
    height: "82%",
}
});
