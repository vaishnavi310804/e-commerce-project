import { StyleSheet, Text, View, FlatList,ActivityIndicator } from 'react-native'
import React, {useEffect , useState} from 'react'
import ScreenWrapper from '@/src/components/common/ScreenWrapper'
import { getCart, CartData } from '@/src/api/cart.api'
import Colors from '@/src/constants/colors'

const CartScreen = () => {

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartData | null>(null);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);
   
  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
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

  return (
    <ScreenWrapper>
      <FlatList
        data={cart?.items}
        keyExtractor={(item) => item.product._id}
        renderItem={({ item }) => (
          <Text>{item.product.name}</Text>
        )}
      />
    </ScreenWrapper>
  )
}

export default CartScreen

const styles = StyleSheet.create({})