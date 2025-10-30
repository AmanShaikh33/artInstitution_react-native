
import React, { useEffect, useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import {
  getScheduledClasses,
  scheduleClass,
  updateScheduledClass,
} from "../utils/api";

const DashboardCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [detail, setDetail] = useState<string>("Class at 10:00 AM");
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [existingId, setExistingId] = useState<number | null>(null);

  const generateMarkedDates = (data: any[]) => {
    const result: any = {};

    data.forEach((item) => {
      result[item.date] = {
          selected: true,
        selectedColor: "green",
      };
    });

    if (selectedDate) {
      result[selectedDate] = {
        ...(result[selectedDate] || {}),
        selected: true,
        selectedColor: "#4F46E5",
        disableTouchEvent: true,
      };
    }

    return result;
  };

  const fetchScheduled = async () => {
    try {
      const data = await getScheduledClasses();
      setScheduled(data);
      setMarkedDates(generateMarkedDates(data));
    } catch (err) {
      Alert.alert("Error", "Could not fetch scheduled classes");
    }
  };

  useEffect(() => {
    fetchScheduled();
  }, []);

  useEffect(() => {
    const found = scheduled.find((item) => item.date === selectedDate);
    setDetail(found?.detail || "Class at 10:00 AM");
    setExistingId(found?.id || null);
    setMarkedDates(generateMarkedDates(scheduled));
  }, [selectedDate]);

  const handleSubmit = async () => {
    if (!selectedDate || !detail.trim()) {
      Alert.alert("⚠️", "Please select a date and enter class detail.");
      return;
    }

    try {
      if (existingId) {
        // 🔁 Update existing class
        await updateScheduledClass(existingId, {
          date: selectedDate,
          detail,
          present: true,
        });
        Alert.alert("✅ Updated", "Class updated successfully.");
      } else {
        // ➕ Schedule new class
        await scheduleClass(selectedDate, detail);
        Alert.alert("✅ Added", "Class scheduled successfully.");
      }

      setSelectedDate("");
      setDetail("Class at 10:00 AM");
      setExistingId(null);
      fetchScheduled();
    } catch (err: any) {
      Alert.alert("❌ Error", err?.message || "Something went wrong");
    }
  };

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-6">
      <Text className="text-lg font-bold mb-2 text-indigo-800">
        📅 Schedule a Class
      </Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: "#4F46E5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#4F46E5",
          dayTextColor: "#000000",
          arrowColor: "#4F46E5",
          monthTextColor: "#1F2937",
          textDayFontWeight: "500",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "600",
        }}
        style={{
          borderRadius: 12,
          elevation: 2,
        }}
      />

      {selectedDate && (
        <View className="mt-4">
          <Text className="text-sm text-gray-700 mb-2">
            Selected: <Text className="font-semibold">{selectedDate}</Text>
          </Text>

          <TextInput
            value={detail}
            onChangeText={setDetail}
            placeholder="Enter class detail"
            className="border border-gray-300 rounded-lg px-4 py-2 mb-3 text-sm"
          />

          <TouchableOpacity
            className="bg-indigo-600 px-4 py-3 rounded-xl"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-semibold">
              {existingId ? "🔁 Update Class" : "📌 Schedule Class"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DashboardCalendar;
