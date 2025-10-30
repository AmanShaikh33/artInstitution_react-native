import React, { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAllStudents } from "../../utils/api";

const getLoggedInEmail = (stored: any): string | null => {
  const e1 = stored?.email;
  const e2 = stored?.data?.email;
  const email = (e1 || e2 || "").trim();
  return email ? email.toLowerCase() : null;
};

const FeesDetail = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const loadFeesData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem("userData");
        const stored = JSON.parse(userDataStr || "{}");

        const email = getLoggedInEmail(stored);
        if (!email) {
          Alert.alert("Error", "No user email found in session. Please login again.");
          return;
        }

        const students = await fetchAllStudents();
        // Strict match by email (case-insensitive)
        const current = students.find(
          (s: any) => (s?.email || "").trim().toLowerCase() === email
        );

        if (!current) {
          Alert.alert("Error", `Student details not found for ${email}`);
          return;
        }

        setStudent(current);
      } catch (err) {
        console.error("❌ Failed to load fees data:", err);
        Alert.alert("❌", "Failed to load fees data");
      } finally {
        setLoading(false);
      }
    };

    loadFeesData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-2">Loading fees...</Text>
      </View>
    );
  }

  if (!student) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">⚠️ No student data found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 pt-12">
      <Text className="text-2xl font-bold mb-6">💰 Fees Details</Text>

      <View className="bg-white p-4 rounded-xl shadow-md mb-4">
        <Text className="text-lg font-semibold">{student.name}</Text>
        <Text className="text-gray-600">📧 {student.email}</Text>
        <Text className="text-gray-600">📞 {student.phone_no}</Text>
        <Text className="text-gray-600">
          📅 Joined: {student.j_date ? new Date(student.j_date).toLocaleDateString() : "—"}
        </Text>
      </View>

      <View className="bg-indigo-100 p-4 rounded-xl shadow-md">
        <Text className="text-lg font-semibold text-indigo-900 mb-2">Fees Summary</Text>
        <Text className="text-base text-gray-800">Total Fees: ₹{student.total_fees}</Text>
        <Text className="text-base text-red-500 font-bold">Pending Fees: ₹{student.pending_fees}</Text>
      </View>
    </ScrollView>
  );
};

export default FeesDetail;
