import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";

interface ReviewCardProps {
  review: any;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const reviewDate = new Date(review.createdAt).toLocaleDateString();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri:
                review.user.profileImage ||
                "https://ui-avatars.com/api/?name=User",
            }}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.name}>
              {review.user.fullName}
            </Text>

            <Text style={styles.date}>
              {reviewDate}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= review.rating ? "star" : "star-outline"}
            size={16}
            color="#F4B400"
          />
        ))}

        <Text style={styles.ratingText}>
          {review.rating.toFixed(1)}
        </Text>
      </View>

      {!!review.comment && (
        <Text style={styles.comment}>
          {review.comment}
        </Text>
      )}
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
    padding: 16,
    marginBottom: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  name: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.text,
  },

  date: {
    marginTop: 3,
    color: Colors.gray,
    fontFamily: Fonts.regular,
    fontSize: 12,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  ratingText: {
    marginLeft: 8,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    fontSize: 15,
  },

  comment: {
    marginTop: 12,
    lineHeight: 22,
    fontFamily: Fonts.regular,
    color: Colors.gray,
    fontSize: 14,
  },
});