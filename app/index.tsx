import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        const userData = await AsyncStorage.getItem("userData");

        if (isLoggedIn === "true" && userData) {
          const user = JSON.parse(userData);
          requestAnimationFrame(() => {
            if (user?.type === "admin") {
              router.replace("/(teacher)/teacherDashboard");
            } else {
              router.replace("/(users)/userdashboard");
            }
          });
        } else {
          requestAnimationFrame(() => {
            router.replace("/(onboarding)/slide1");
          });
        }
      } catch (err) {
        console.error("Error:", err);
        router.replace("/(onboarding)/slide1");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return null; 
}
