import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import {
  getMessaging,
  onMessage,
  setAutoInitEnabled,
  onNotificationOpenedApp,
  getInitialNotification,
  onTokenRefresh,
} from "@react-native-firebase/messaging";

import {
  syncFcmTokenValue,
} from "@/src/services/notification.service";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Initialize Firebase Notification Service
  useEffect(() => {
    const messaging = getMessaging();

    setAutoInitEnabled(messaging, true);
  }, []);

  // FCM Token Refresh Handler
  useEffect(() => {
    const messaging = getMessaging();

    const unsubscribe = onTokenRefresh(
      messaging,
      async (newToken) => {
        try {
          console.log("FCM Token refreshed:", newToken);

          await syncFcmTokenValue(newToken);

          console.log("Refreshed FCM token synced successfully.");
        } catch (error) {
          console.log(
            "Failed to sync refreshed FCM token:",
            error,
          );
        }
      },
    );

    return () => unsubscribe();
  }, []);

  // Notification Interaction Handlers
  useEffect(() => {
    const messaging = getMessaging();

    // Handle notification tap when app is running in background
    const unsubscribeOpenedApp = onNotificationOpenedApp(
      messaging,
      (remoteMessage) => {
        console.log(
          "App opened from background via notification tap:",
          JSON.stringify(remoteMessage, null, 2),
        );
      },
    );

    // Handle notification tap when app was launched from quit state
    getInitialNotification(messaging).then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "App launched from quit state via notification tap:",
          JSON.stringify(remoteMessage, null, 2),
        );
      }
    });

    return () => unsubscribeOpenedApp();
  }, []);

  // Foreground Notification Handler
  useEffect(() => {
    const unsubscribe = onMessage(
      getMessaging(),
      async (remoteMessage) => {
        console.log(
          "Foreground Notification Title:",
          remoteMessage.notification?.title,
        );

        console.log(
          "Foreground Notification Body:",
          remoteMessage.notification?.body,
        );

        console.log(
          "Foreground Notification Data Payload:",
          remoteMessage.data,
        );

        // Display the FCM notification visibly while app is open
        if (
          remoteMessage.notification?.title ||
          remoteMessage.notification?.body
        ) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title:
                remoteMessage.notification?.title || "ShopEase",
              body: remoteMessage.notification?.body || "",
              data: remoteMessage.data || {},
              sound: "default",
            },
            trigger: null,
          });
        }
      },
    );

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}