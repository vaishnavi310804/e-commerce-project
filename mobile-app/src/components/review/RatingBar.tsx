import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '@/src/constants/colors'
import Fonts from '@/src/constants/fonts'


interface RatingBarProps {
  star: number;
  count: number;
  maxCount: number;
}

const RatingBar = ({ star, count, maxCount }: RatingBarProps) => {
  const width =
    maxCount === 0 ? "0%" : `${(count / maxCount) * 100}%`;
  return (
    <View style={styles.container}>
      <Text style={styles.star}>{star}</Text>

      <View style={styles.barBackground}>
        <View style={[styles.barFill,]} />
      </View>
    </View>
  )
}

export default RatingBar

const styles = StyleSheet.create({
    container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },

  star: {
    width: 16,
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.text,
  },

  barBackground: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ECECEC",
    marginLeft: 10,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
})