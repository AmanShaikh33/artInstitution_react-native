import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { createStudentByTeacher } from "../../utils/api";

export default function AddStudent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_no: "",
    j_date: "",
    total_fees: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, password, phone_no, j_date, total_fees } = form;

    if (!name || !email || !password || !phone_no || !j_date || !total_fees) {
      Alert.alert("⚠️ Missing Info", "Please fill all fields.");
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        phone_no: parseInt(phone_no),
        j_date,
        total_fees: parseInt(total_fees), // ✅ Correct field name for backend
      };

      const res = await createStudentByTeacher(payload);

      Alert.alert("✅ Success", res.message || "Student added successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        phone_no: "",
        j_date: "",
        total_fees: "",
      });
    } catch (error: any) {
      Alert.alert("❌ Error", error.message || "Failed to add student.");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = dayjs(selectedDate).format("YYYY-MM-DD");
      handleChange("j_date", formatted);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4 text-black">➕ Add New Student</Text>

      {[
        { label: "Name", key: "name", keyboardType: "default" },
        { label: "Email", key: "email", keyboardType: "email-address" },
        { label: "Password", key: "password", keyboardType: "default" },
        { label: "Phone Number", key: "phone_no", keyboardType: "numeric" },
        { label: "Total Fees", key: "total_fees", keyboardType: "numeric" }, // ✅ renamed
      ].map((field) => (
        <View key={field.key} className="mb-4">
          <Text className="text-black mb-1">{field.label}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 text-black"
            value={(form as any)[field.key]}
            onChangeText={(text) => handleChange(field.key, text)}
            placeholder={field.label}
            placeholderTextColor="#999"
            keyboardType={field.keyboardType as any}
            secureTextEntry={field.key === "password"}
          />
        </View>
      ))}

      {/* 📅 Joining Date */}
      <View className="mb-4">
        <Text className="text-black mb-1">Joining Date</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
          <TextInput
            className="flex-1 text-black"
            value={form.j_date}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
            editable={false}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={22} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={form.j_date ? new Date(form.j_date) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-indigo-600 py-3 rounded-xl mt-2"
      >
        <Text className="text-white text-center font-bold text-base">
          📤 Submit Student
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
