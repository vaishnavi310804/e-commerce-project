import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import Colors from "@/src/constants/colors";
import Fonts from "@/src/constants/fonts";
import { getProductReviews } from "@/src/api/review.api";
import ReviewCard from "@/src/components/review/ReviewCard";
import RatingBar from "@/src/components/review/RatingBar";
import WriteReview from "@/src/components/review/WriteReview";

const ReviewScreen = () => {
  const { productId } = useLocalSearchParams<{
    productId: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await getProductReviews(productId);
      setReviewData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenWrapper>
    );
  }
  const distribution = reviewData?.ratingDistribution;

  const maxCount = distribution
    ? Math.max(
        distribution[5],
        distribution[4],
        distribution[3],
        distribution[2],
        distribution[1],
      )
    : 0;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Reviews</Text>

          <View style={styles.blank} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.averageRating}>
                {reviewData.averageRating.toFixed(1)}
              </Text>

              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={18} color="#F4B400" />
                ))}
              </View>

              <Text style={styles.totalReviews}>
                {reviewData.totalReviews} Reviews
              </Text>
            </View>
            <View style={styles.rightContainer}>
              <RatingBar
                star={5}
                count={reviewData.ratingDistribution[5]}
                maxCount={maxCount}
              />
              <RatingBar
                star={4}
                count={reviewData.ratingDistribution[4]}
                maxCount={maxCount}
              />
              <RatingBar
                star={3}
                count={reviewData.ratingDistribution[3]}
                maxCount={maxCount}
              />
              <RatingBar
                star={2}
                count={reviewData.ratingDistribution[2]}
                maxCount={maxCount}
              />
              <RatingBar
                star={1}
                count={reviewData.ratingDistribution[1]}
                maxCount={maxCount}
              />
            </View>
          </View>
          <View style={styles.divider} />
          {reviewData?.reviews?.map((review: any) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => setShowReview(true)}
        >
          <Text style={styles.buttonText}>Write Review</Text>
        </TouchableOpacity>
        {showReview && (
          <WriteReview
            productId={productId}
            onSuccess={fetchReviews}
            onClose={() => setShowReview(false)}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  summaryContainer: {
    flexDirection: "row",
    marginVertical: 20,
    alignItems: "center",
  },
  blank: {
    width: 42,
  },
  leftContainer: {
    flex: 1,
    alignItems: "center",
  },

  rightContainer: {
    flex: 1.4,
  },

  averageRating: {
    fontSize: 44,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },

  starRow: {
    flexDirection: "row",
    marginTop: 8,
  },

  totalReviews: {
    marginTop: 8,
    color: Colors.gray,
    fontFamily: Fonts.medium,
  },
  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 20,
  },
  button: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
