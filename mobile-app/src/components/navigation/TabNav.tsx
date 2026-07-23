import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/constants/colors";

const TabNav = ({ state, navigation }: BottomTabBarProps) => {
  const tabs = [
    {
      route: "index",
      activeIcon: "home",
      inactiveIcon: "home-outline",
    },
    {
      route: "search",
      activeIcon: "search",
      inactiveIcon: "search",
    },
    {
      route: "wishlist",
      activeIcon: "heart",
      inactiveIcon: "heart-outline",
    },
    {
      route: "cart",
      activeIcon: "cart",
      inactiveIcon: "cart-outline",
    },
    {
      route: "profile",
      activeIcon: "person",
      inactiveIcon: "person-outline",
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const focused = state.index === index;

        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(tab.route as never)}
          >
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={
                  focused ? (tab.activeIcon as any) : (tab.inactiveIcon as any)
                }
                size={20}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabNav;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#1B1B1B",
    elevation: 8,
  },

  tab: {
    flex: 1,
    alignItems: "center",
  },

  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  activeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
