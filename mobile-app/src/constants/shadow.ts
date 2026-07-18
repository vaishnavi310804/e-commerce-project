import { Platform } from "react-native";

const Shadow = {
  card: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 6,
      },
    },
    android: {
      elevation: 4,
    },
  }),
};

export default Shadow;