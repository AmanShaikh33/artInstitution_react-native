import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { fetchAllAttendance, deleteAttendance } from "../utils/api";

export default function PreviousAttendance({ refresh }: { refresh: boolean }) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllAttendance();
        setRecords(data);
      } catch (e) {
        console.error("❌ Fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refresh]);

  const grouped = records.reduce((acc: any, curr: any) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  const handleDelete = async (id: number) => {
    try {
      await deleteAttendance(id);
      Alert.alert("✅", "Attendance deleted");
      // Refresh after deletion
      const updated = await fetchAllAttendance();
      setRecords(updated);
    } catch (e) {
      Alert.alert("❌", "Failed to delete");
    }
  };

  return (
    <View className="mt-8">
      <Text className="text-xl font-bold mb-3 text-gray-800">📆 Previous Attendance</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.entries(grouped).map(([date, group]: any, index) => (
            <View
              key={index}
              className="bg-gray-100 rounded-xl mr-4 w-64 p-4 shadow"
            >
              <Text className="text-base font-semibold mb-2 text-gray-700">{date}</Text>
              {group.map((r: any) => (
                <View
                  key={r.id}
                  className="flex-row justify-between items-center mb-1"
                >
                  <View>
                    <Text className="text-sm">{r.student_name}</Text>
                    <Text className="text-xs">{r.present ? "✅ Present" : "❌ Absent"}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(r.id)}
                    className="ml-2 bg-red-500 px-2 py-1 rounded"
                  >
                    <Text className="text-white text-xs">🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
