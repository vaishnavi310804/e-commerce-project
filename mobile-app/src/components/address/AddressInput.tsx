import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import Colors from '@/src/constants/colors';
import Fonts from '@/src/constants/fonts';


type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: any;
};

const AddressInput = ({label,
  value,
  onChangeText,
  placeholder,
  keyboardType="default"}:Props) => {
  return (
    <View style={styles.header}>
      <Text
        style={styles.label}
      >
        {label}
      </Text>
       <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
        style={styles.textInput}
      />
    </View>
  )
}

export default AddressInput;

const styles = StyleSheet.create({
    header:{
         marginBottom: 18 
    },
    label:{
        fontFamily: Fonts.semibold,
          fontSize: 15,
          marginBottom: 8,
          color: Colors.text,
    },
    textInput:{
        height: 54,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          paddingHorizontal: 16,
          fontFamily: Fonts.medium,
          fontSize: 15,
          backgroundColor: "#FFF",
    }
})