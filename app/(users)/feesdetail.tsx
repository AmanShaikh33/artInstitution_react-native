import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { fetchAllStudents } from "../../utils/api";

const FeesDetail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const loadFeesData = async () => {
      try {
        // get logged-in user id from AsyncStorage
        const userDataStr = await AsyncStorage.getItem("userData");
        const userData = JSON.parse(userDataStr || "{}");

        if (!userData?.id) {
          Alert.alert("Error", "No user data found");
          return;
        }

        // fetch all students from API
        const students = await fetchAllStudents();

        console.log("📌 All Students from API:", students);

        // find current logged-in student
        const currentStudent = students.find(
          (s: any) => s.id === userData.id
        );

        if (!currentStudent) {
          Alert.alert("Error", "Student not found in API");
          return;
        }

        setStudent(currentStudent);
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
        <Text className="text-gray-600">📅 Joined: {student.j_date}</Text>
      </View>

      <View className="bg-indigo-100 p-4 rounded-xl shadow-md">
        <Text className="text-lg font-semibold text-indigo-900 mb-2">
          Fees Summary
        </Text>
        <Text className="text-base text-gray-800">
          Total Fees: ₹{student.total_fees}
        </Text>
        <Text className="text-base text-red-500 font-bold">
          Pending Fees: ₹{student.pending_fees}
        </Text>
      </View>
    </ScrollView>
  );
};

export default FeesDetail;
