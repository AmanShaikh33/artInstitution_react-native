
import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { getScheduledClasses } from "../utils/api";

const StudentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDetail, setSelectedDetail] = useState<string>("");

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
    setMarkedDates(generateMarkedDates(scheduled));
    const found = scheduled.find((item) => item.date === selectedDate);
    setSelectedDetail(found?.detail || "");
  }, [selectedDate]);

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-6">
      <Text className="text-lg font-bold mb-2 text-indigo-800">
        📅 Your Attendance Calendar
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

      {selectedDate && selectedDetail ? (
        <Text className="mt-4 text-green-700 text-sm font-medium">
          📌 Scheduled: {selectedDetail}
        </Text>
      ) : selectedDate ? (
        <Text className="mt-4 text-sm text-gray-500">No class scheduled.</Text>
      ) : null}
    </View>
  );
};

export default StudentCalendar;
