import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { fetchAllNotices, fetchAllAttendance } from "../../utils/api";
import StudentCalendar from "../../components/StudentCalendar";

const UserDashboard = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem("userData");
        const userData = JSON.parse(userDataStr || "{}");

        if (!userData?.id) {
          Alert.alert("Error", "No user data found");
          return;
        }

        setUserName(userData.name || "");
        setUserId(userData.id);

        const noticeData = await fetchAllNotices();
        setNotices(noticeData.slice(-5).reverse());

        const allAttendance = await fetchAllAttendance();
        const studentAttendance = allAttendance.filter(
          (a: any) => a.student === userData.id
        );
        setAttendanceData(studentAttendance);
      } catch (err) {
        Alert.alert("❌", "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const presentDays = attendanceData.filter((a) => a.present).length;
  const totalDays = attendanceData.length;
  const attendancePercentage = totalDays
    ? Math.round((presentDays / totalDays) * 100)
    : 0;

  const confirmLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Do you really want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: handleLogout },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("token");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 pt-12">
      {/* Welcome text & Logout */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900 flex-1">
          Welcome to Your Dashboard{userName ? `, ${userName}` : ""} 👋
        </Text>
        <TouchableOpacity
          onPress={confirmLogout}
          className="bg-red-500 px-4 py-2 rounded-lg shadow-md active:opacity-80"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Student Calendar */}
      <View className="mb-6 rounded-xl overflow-hidden shadow">
        <StudentCalendar />
      </View>

      {/* Attendance Overview */}
      <View className="bg-indigo-100 p-4 rounded-xl my-4 shadow-sm">
        <Text className="text-lg font-semibold text-indigo-800 mb-3">
          📊 Attendance Overview
        </Text>
        <Text className="text-base text-gray-800">
          ✅ Present: {presentDays} days
        </Text>
        <Text className="text-base text-gray-800">
          ❌ Absent: {totalDays - presentDays} days
        </Text>
        <Text className="text-base text-gray-800">
          📈 Percentage: {attendancePercentage}%
        </Text>
      </View>

      {/* Latest Notices */}
      <Text className="text-xl font-bold mb-3 text-gray-900">
        📢 Latest Notices
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" className="mt-4" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2"
        >
          {notices.map((item) => (
            <View
              key={item.id}
              className="bg-yellow-50 border border-yellow-200 p-4 mr-4 rounded-2xl w-64 shadow-md h-[200px]"
            >
              <Text className="font-bold text-lg text-yellow-800 mb-1">
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

export default UserDashboard;
