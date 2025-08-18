import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { fetchAllNotices } from "../../utils/api";
import DashboardCalendar from "../../components/DashboardCalendar.tsx";
import AttendanceStatsCard from "../../components/AttendanceStatsCard.tsx"; // ✅ new stats card

const TeacherDashboard = () => {
  const router = useRouter();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("isLoggedIn");
          await AsyncStorage.removeItem("userData");
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await fetchAllNotices();
        setNotices(data.slice(-5).reverse());
      } catch (err) {
        Alert.alert("❌", "Failed to load notices");
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-12">
      <Text className="text-2xl font-bold text-black mb-6 text-center">
        Welcome, Teacher 👨‍🏫
      </Text>

      {/* ✅ Attendance Stats */}
      <AttendanceStatsCard />

      <TouchableOpacity
        onPress={() => router.push("/(teacher)/EditStudentsScreen")}
        className="bg-blue-600 py-3 px-4 rounded-xl mb-6"
      >
        <Text className="text-white text-center font-bold text-base">
          ✏️ Edit Students
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red-600 px-8 py-3 rounded-xl mb-4"
        onPress={handleLogout}
      >
        <Text className="text-white text-base font-semibold text-center">
          Logout
        </Text>
      </TouchableOpacity>

      {/* ✅ Calendar Component */}
      <DashboardCalendar />

      <Text className="text-xl font-bold mb-3 text-gray-800">
        📢 Latest Notices
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2 mb-4"
        >
          {notices.map((item) => (
            <View
              key={item.id}
              className="bg-indigo-50 border border-indigo-200 p-4 mr-4 rounded-2xl w-64 shadow-md h-[200px]"
            >
              <Text className="font-bold text-lg text-indigo-800 mb-1">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-700 mb-2">
                {item.description || "No description provided."}
              </Text>
              <Text className="text-xs text-gray-500 italic">
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
};

export default TeacherDashboard;
