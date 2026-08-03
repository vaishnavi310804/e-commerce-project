import * as Location from "expo-location";

export interface CurrentLocation {
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = async (): Promise<CurrentLocation | null> => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    return null;
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const result = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  if (!result.length) {
    return null;
  }

  const place = result[0];

  return {
    city: place.city || "",
    state: place.region || "",
    country: place.country || "",
    postalCode: place.postalCode || "",
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};