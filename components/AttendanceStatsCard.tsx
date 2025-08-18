// components/AttendanceStatsCard.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import dayjs from "dayjs";
import { fetchAllStudents, fetchAllAttendance } from "../utils/api";

const AttendanceStatsCard = () => {
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentToday, setPresentToday] = useState(0);

  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const loadData = async () => {
      try {
        const students = await fetchAllStudents();
        const attendanceRecords = await fetchAllAttendance();

        const todaysPresent = attendanceRecords.filter(
          (record: any) => record.date === today && record.present
        );

        setTotalStudents(students.length);
        setPresentToday(todaysPresent.length);
      } catch (err) {
        console.error("❌ Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View className="bg-white p-4 rounded-xl shadow-md mb-4">
        <ActivityIndicator size="small" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-md mb-4">
      <Text className="text-lg font-bold text-black mb-2">📊 Attendance Stats</Text>
      <Text className="text-base text-gray-800">👥 Total Students: {totalStudents}</Text>
      <Text className="text-base text-green-600">✅ Present Today: {presentToday}</Text>
    </View>
  );
};

export default AttendanceStatsCard;
