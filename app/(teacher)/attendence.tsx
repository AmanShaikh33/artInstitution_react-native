import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import dayjs from "dayjs";
import {
  fetchAllStudents,
  fetchAllAttendance,
  addAttendance,
  updateAttendance,
} from "../../utils/api";
import PreviousAttendance from "../../components/PreviousAttendance";

export default function AttendanceScreen() {
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [records, setRecords] = useState<any[]>([]);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading state

  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const studentData = await fetchAllStudents();
        const attendanceData = await fetchAllAttendance();

        const filtered = studentData.map((s: any) => ({
          id: s.id.toString(),
          name: s.name,
        }));

        setStudents(filtered);
        setRecords(attendanceData);
      } catch (err) {
        console.error("❌ Initial load failed:", err);
        Alert.alert("Error", "Failed to load data");
      }
    };

    loadInitialData();
  }, []);

  const toggleSwitch = (id: string) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async () => {
    setLoading(true); // ✅ start loading
    try {
      for (const student of students) {
        const present = attendance[student.id] || false;

        const existing = records.find(
          (r) => r.student === parseInt(student.id) && r.date === today
        );

        if (existing) {
          await updateAttendance(existing.id, {
            date: today,
            present,
            student: parseInt(student.id),
          });
        } else {
          await addAttendance({
            date: today,
            present,
            student: parseInt(student.id),
          });
        }
      }

      setAttendance({});
      setRefreshHistory((prev) => !prev);
      Alert.alert("✅", "Attendance submitted/updated successfully!");
    } catch (err) {
      console.error("❌ Submission error:", err);
      Alert.alert("Error", "Something went wrong while saving attendance");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4 text-black">📅 Mark Attendance</Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
            <Text className="text-lg text-black">{item.name}</Text>
            <Switch
              value={attendance[item.id] || false}
              onValueChange={() => toggleSwitch(item.id)}
              thumbColor={attendance[item.id] ? "#4F46E5" : "#ccc"}
              trackColor={{ false: "#ccc", true: "#a5b4fc" }}
            />
          </View>
        )}
        ListFooterComponent={
          <View className="mt-4">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-indigo-600"
              } py-3 rounded-xl mb-3`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-bold text-base">
                  ✅ Submit / Update Attendance
                </Text>
              )}
            </TouchableOpacity>

            <PreviousAttendance refresh={refreshHistory} />
          </View>
        }
      />
    </View>
  );
}
