import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import Radius from "@/src/constants/radius";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading || disabled}
      style={[
        styles.button,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,

    justifyContent: "center",
    alignItems: "center",
  },

  disabled: {
    opacity: 0.6,
  },

  text: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: Colors.white,
  },
});