import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  fetchAllStudents,
  deleteStudent,
  payStudentFees,
  fetchAllAttendance,
} from "../../utils/api";

export default function EditStudentsScreen() {
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ User input
  const [debouncedQuery, setDebouncedQuery] = useState(""); // ✅ Debounced value

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, attendance] = await Promise.all([
          fetchAllStudents(),
          fetchAllAttendance(),
        ]);

        const formattedStudents = studentsData.map((s: any) => ({
          id: String(s.id),
          name: s.name,
          totalFees: s.total_fees,
          pendingFees: s.pending_fees,
          joiningDate: s.j_date,
        }));

        setStudents(formattedStudents);
        setAttendanceData(attendance);
      } catch (err) {
        Alert.alert("Error", "Failed to load students or attendance");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ✅ Debounce logic (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this student?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteStudent(id);
              setStudents((prev) => prev.filter((s) => s.id !== id));
              Alert.alert("✅", "Student deleted");
            } catch (err) {
              Alert.alert("❌", "Failed to delete student");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleOpenPayModal = (student: any) => {
    setSelectedStudent(student);
    setAmount("");
    setRemarks("");
    setModalVisible(true);
  };

  const handlePay = async () => {
    if (!amount) {
      Alert.alert("⚠️", "Please enter an amount");
      return;
    }
    try {
      const res = await payStudentFees(
        Number(selectedStudent.id),
        Number(amount),
        remarks || "No remarks"
      );

      // Update student pending fees locally
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id
            ? { ...s, pendingFees: res.pending_fees }
            : s
        )
      );

      Alert.alert("✅ Success", res.message);
      setModalVisible(false);
    } catch (err) {
      Alert.alert("❌", "Failed to record payment");
    }
  };

  const calculateMonthlyAttendance = (studentId: string) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const studentAttendance = attendanceData.filter((a: any) => {
      const date = new Date(a.date);
      return (
        a.student === Number(studentId) &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });

    const presentDays = studentAttendance.filter((a) => a.present).length;

    // ✅ Dynamically get total days in current month
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    return `${presentDays}/${totalDays}`;
  };

  // ✅ Use debouncedQuery for filtering instead of searchQuery
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4 text-black">👨‍🎓 Manage Students</Text>

      {/* ✅ Search Bar */}
      <TextInput
        placeholder="Search student by name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        className="border border-gray-300 p-3 rounded mb-4 text-black"
      />

      <FlatList
        data={filteredStudents} // ✅ Use filtered students
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-6">
            No students found.
          </Text>
        }
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-black">{item.name}</Text>
            <Text className="text-sm text-gray-600">💰 Total Fees: ₹{item.totalFees}</Text>
            <Text className="text-sm text-gray-600">⏳ Pending Fees: ₹{item.pendingFees}</Text>
            <Text className="text-sm text-gray-600">
              📅 Joining Date: {new Date(item.joiningDate).toLocaleDateString()}
            </Text>
            <Text className="text-sm text-blue-600 font-semibold">
              ✅ Attendance This Month: {calculateMonthlyAttendance(item.id)}
            </Text>

            <View className="flex-row mt-2">
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="bg-red-500 px-4 py-2 rounded mr-2"
              >
                <Text className="text-white font-bold">Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleOpenPayModal(item)}
                className="bg-green-500 px-4 py-2 rounded"
              >
                <Text className="text-white font-bold">Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Payment Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-80">
            <Text className="text-lg font-bold mb-4 text-black">
              Pay Fees for {selectedStudent?.name}
            </Text>

            <TextInput
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              className="border border-gray-300 p-2 rounded mb-3 text-black"
            />

            <TextInput
              placeholder="Remarks (optional)"
              value={remarks}
              onChangeText={setRemarks}
              className="border border-gray-300 p-2 rounded mb-3 text-black"
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-400 px-4 py-2 rounded"
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePay}
                className="bg-green-600 px-4 py-2 rounded"
              >
                <Text className="text-white font-bold">Paid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
