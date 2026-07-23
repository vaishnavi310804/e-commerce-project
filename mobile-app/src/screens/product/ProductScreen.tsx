import react, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import Colors from "@/src/constants/colors";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import Fonts from "@/src/constants/fonts";
import { getProductById, Product } from "@/src/api/product.api";
import { addToCart, getCart } from "../../api/cart.api";

export default function ProductScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenWrapper>
    );
  }
  if (!product) {
    return (
      <ScreenWrapper>
        <Text>Product not found</Text>
      </ScreenWrapper>
    );
  }

  const checkProductInCart = async () => {
    try {
      const response = await getCart();
      const exists = response.data.items.some(
        (item: any) => item.product._id === product?._id,
      );
      setIsInCart(exists);
    } catch (error) {
      console.log(error);
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product._id);
      setIsInCart(true);
      Alert.alert("Success", "Product added to cart.");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (product) {
      checkProductInCart();
    }
  }, [product]);
if (loading || cartLoading) {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart-outline" size={22} color={Colors.text} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton}>
                <Feather name="share-2" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.productImage.url }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.infoContainer}>
            {product.brand ? (
              <Text style={styles.brand}>{product.brand}</Text>
            ) : null}

            <Text style={styles.productName}>{product.name}</Text>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color="#F4B400" />

              <Text style={styles.rating}>
                {product.averageRating.toFixed(1)}
              </Text>

              <Text style={styles.reviewCount}>
                ({product.numReviews || 0} Reviews)
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.discountPrice}>
                ₹{product.discountPrice ?? product.price}
              </Text>

              {product.discountPrice && (
                <Text style={styles.originalPrice}>₹{product.price}</Text>
              )}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>

              <Text style={styles.description}>{product.description}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.cartButton}
            activeOpacity={0.8}
            onPress={() => {
              if (isInCart) {
                router.push("/cart");
              } else {
                handleAddToCart();
              }
            }}
          >
            <Ionicons
              name={isInCart ? "cart" : "cart-outline"}
              size={22}
              color={Colors.primary}
            />

            <Text style={styles.cartButtonText}>
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 2,
  },

  headerActions: {
    flexDirection: "row",
    gap: 12,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:Colors.border,
  },

  image: {
    width: "90%",
    height: "100%",
  },
  infoContainer: {
    paddingHorizontal: 20,
  },

  brand: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginBottom: 3,
  },

  productName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    lineHeight: 30,
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

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  discountPrice: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },

  originalPrice: {
    marginLeft: 12,
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.gray,
    textDecorationLine: "line-through",
  },
  detailsContainer: {
    marginTop: 28,
    paddingHorizontal: 20,
  },

  descriptionContainer: {
    marginTop: 20,
    // paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.gray,
    fontFamily: Fonts.regular,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
  },

  cartButton: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginRight: 10,
  },

  cartButtonText: {
    marginLeft: 8,
    fontFamily: Fonts.semibold,
    color: Colors.primary,
    fontSize: 16,
  },

  buyButton: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  buyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
