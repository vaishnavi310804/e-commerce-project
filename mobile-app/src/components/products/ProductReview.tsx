import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Fonts from "@/src/constants/fonts";
import Colors from "@/src/constants/colors";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";

interface ProductReviewProps {
  loading: boolean;
  reviewData: any;
  productId: string;
}

const ProductReview = ({
  loading,
  reviewData,
  productId,
}: ProductReviewProps) => {
  return (
    <View style={styles.reviewSection}>
      <View style={styles.reviewHeader}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/product/review",
              params: {
                productId: productId,
              },
            })
          }
        >
          <Text style={styles.seeMore}>See More</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : reviewData?.reviews?.length ? (
        <>
          <View style={styles.ratingSummary}>
            <Ionicons name="star" size={18} color="#F4B400" />

            <Text style={styles.rating}>
              {reviewData.averageRating.toFixed(1)}
            </Text>

            <Text style={styles.reviewCount}>
              ({reviewData.totalReviews} Reviews)
            </Text>
          </View>

          {reviewData.reviews.slice(0, 5).map((review: any) => (
            <View key={review._id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <Text style={styles.reviewUser}>{review.user?.fullName || "Anonymous"}</Text>
                <View style={{ flexDirection: "row" }}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Ionicons
                      key={index}
                      name="star"
                      size={14}
                      color="#F4B400"
                    />
                  ))}
                </View>
              </View>

              {!!review.comment && (
                <Text style={styles.reviewComment}>{review.comment}</Text>
              )}
            </View>
          ))}
        </>
      ) : (
        <Text style={styles.noReviews}>
          Be the first one to leave a review.
        </Text>
      )}
    </View>
  );
};

export default ProductReview;

const styles = StyleSheet.create({
  reviewSection: {
    marginTop: 30,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  seeMore: {
    color: Colors.primary,
    fontFamily: Fonts.semibold,
    fontSize: 14,
  },
  ratingSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  reviewCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  reviewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewUser: {
    fontFamily: Fonts.semibold,
    fontSize: 15,
    color: Colors.text,
  },
  reviewComment: {
    marginTop: 8,
    color: Colors.gray,
    lineHeight: 22,
    fontFamily: Fonts.regular,
  },
  noReviews: {
    color: Colors.gray,
    fontFamily: Fonts.regular,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  rating: {
    marginLeft: 6,
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
  reviewCount: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.gray,
  },
});
