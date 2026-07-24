import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";
import { router, Href } from "expo-router";
import ProfileMenu from "@/src/components/profile/ProfileMenu";
import { getCurrentUser, AuthUser } from "@/src/api/auth.api";
import ProfileCard from "@/src/components/profile/ProfileCard";

type MenuItem = {
  title: string;
  icon: React.ReactNode;
  route: Href;
};

const menuItems: MenuItem[] = [
  {
    title: "Your Profile",
    icon: <Ionicons name="person-outline" size={22} color={Colors.primary} />,
    route: "/profile",
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

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <View>
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
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
