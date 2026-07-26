import { Tabs } from "expo-router";
import TabNav from "@/src/components/navigation/TabNav";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
       <Tabs.Screen name="index" />
       <Tabs.Screen name="my-order" />
       <Tabs.Screen name="wishlist" />
       <Tabs.Screen name="cart" />
       <Tabs.Screen name="profile" />
    </Tabs>
  );
}