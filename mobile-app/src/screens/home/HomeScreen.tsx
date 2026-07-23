import React, { useState, useEffect } from "react";
import axios from "axios";
import { ScrollView } from "react-native";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import HomeHeader from "@/src/components/home/HomeHeader";
import SearchBar from "@/src/components/home/SearchBar";
import BannerCarousel from "@/src/components/home/BannerCarousel";
import CategorySection from "@/src/components/home/CategorySection";
import { getCurrentUser, AuthUser } from "@/src/api/auth.api";
import { router } from "expo-router";
import { Address, getDefaultAddress } from "@/src/api/address.api";
import BestSellerSection from "@/src/components/home/BestSellerSection";

const HomeScreen = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const userRes = await getCurrentUser();

    const addressRes = await getDefaultAddress();

    setUser(userRes.data ?? null);
    setAddress(addressRes.data ?? null);
  } catch (error) {
    if (axios.isAxiosError(error)) {
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
  } else {
    console.log(error);
  }
  }
};

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <HomeHeader
          name={user?.fullName}
          image={user?.profileImage}
          address={address ? `${address.city}, ${address.state}` : undefined}
        //   onLocationPress={() => router.push("/address")}
        onLocationPress={() => console.log("Open Address Screen")}
        />

        <SearchBar value={search} onChangeText={setSearch} />

        <BannerCarousel />
        <CategorySection />
        <BestSellerSection/>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default HomeScreen;
