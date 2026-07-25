import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import SearchBar from '@/src/components/home/SearchBar'
import ScreenWrapper from '@/src/components/common/ScreenWrapper'

const SearchScreen = () => {
    const [search, setSearch] = useState("");
  return (
    <ScreenWrapper>
       <SearchBar value={search} onChangeText={setSearch} />
    </ScreenWrapper>
  )
}

export default SearchScreen

const styles = StyleSheet.create({})