import { ScrollView, StyleSheet } from "react-native";
import React, { useState, useCallback } from "react";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import { router, Href, useFocusEffect } from "expo-router";
import ProfileMenu from "@/src/components/profile/ProfileMenu";
import { getCurrentUser, AuthUser } from "@/src/api/auth.api";
import ProfileCard from "@/src/components/profile/ProfileCard";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";

type MenuItem = {
  title: string;
  icon: React.ReactNode;
  route: Href;
};

const menuItems: MenuItem[] = [
  {
    title: "Edit Profile",
    icon: <Ionicons name="person-outline" size={22} color={Colors.primary} />,
    route: "/edit-profile",
  },
  {
    title: "Manage Address",
    icon: <Ionicons name="location-outline" size={22} color={Colors.primary} />,
    route: "/address",
  },
  {
    title: "Payment Methods",
    icon: <MaterialIcons name="payment" size={22} color={Colors.primary} />,
    route: "/payment-method",
  },
  {
    title: "My Orders",
    icon: (
      <Ionicons name="bag-handle-outline" size={22} color={Colors.primary} />
    ),
    route: "/my-order",
  },
  {
    title: "Wishlist",
    icon: <Ionicons name="heart-outline" size={22} color={Colors.primary} />,
    route: "/wishlist",
  },
  {
    title: "Tickets",
    icon: <Ionicons name="ticket-outline" size={22} color={Colors.primary} />,
    route: "/ticket-details",
  },
  {
    title: "Settings",
    icon: <Feather name="settings" size={22} color={Colors.primary} />,
    route: "/settings",
  },
];

const ProfileScreen = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard
          name={user?.fullName ?? ""}
          email={user?.email ?? ""}
          image={user?.profileImage}
          onEditPress={() => router.push("/edit-profile")}
        />
        {menuItems.map((item) => (
          <ProfileMenu
            key={item.title}
            title={item.title}
            icon={item.icon}
            onPress={() => router.push(item.route)}
          />
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    flexGrow: 1,
  },
});
