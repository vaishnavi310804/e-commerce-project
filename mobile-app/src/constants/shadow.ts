import { Platform } from "react-native";

const Shadow = {
  card: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: {
        width: 0,
        height: 10,
      },
    },
    android: {
      elevation: 8,
    },
  }),
};

export default Shadow;