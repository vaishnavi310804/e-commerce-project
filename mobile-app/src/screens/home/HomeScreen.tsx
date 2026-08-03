import React, { useState, useCallback } from "react";
import axios from "axios";
import { ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import HomeHeader from "@/src/components/home/HomeHeader";
import SearchBar from "@/src/components/home/SearchBar";
import BannerCarousel from "@/src/components/home/BannerCarousel";
import CategorySection from "@/src/components/home/CategorySection";
import BestSellerSection from "@/src/components/home/BestSellerSection";
import { Address, getDefaultAddress } from "@/src/api/address.api";

import { getCurrentUser, AuthUser } from "@/src/api/auth.api";

const HomeScreen = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [address, setAddress] = useState<Address | null>(null);

  const fetchData = useCallback(async () => {
  try {
    const userRes = await getCurrentUser();
    setUser(userRes.data ?? null);

    try {
      const addressRes = await getDefaultAddress();
      setAddress(addressRes.data ??null);
    } catch {
      setAddress(null);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
    } else {
      console.log(error);
    }
  }
}, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <HomeHeader
          name={user?.fullName}
          image={user?.profileImage}
          locationTitle={address ? "Deliver to" : "Current Location"}
          address={
            address
              ? `${address.city}, ${address.state}`
              : user?.currentLocation
                ? `${user.currentLocation.city}, ${user.currentLocation.state}`
                : "Set your location"
          }
          onLocationPress={() => router.push("/address")}
        />

        <SearchBar value={search} onChangeText={setSearch} />

        <BannerCarousel />

        <CategorySection />

        <BestSellerSection />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default HomeScreen;
