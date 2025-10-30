import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import dayjs from "dayjs";
import { addHomework, getAllHomework, deleteHomework } from "../../utils/api";

const Homework = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Fetch latest 5 homework
  const loadHomework = async () => {
    try {
      setRefreshing(true);
      const data = await getAllHomework();
      setHomeworkList(data.slice(0, 5)); // show latest 5
    } catch (err) {
      console.error("❌ Error loading homework:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHomework();
  }, []);

  // ✅ Handle Add Homework
  const handleAddHomework = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Validation", "Title and Description are required!");
      return;
    }

    setLoading(true);
    try {
      const created_at = dayjs().toISOString();
      const response = await addHomework(title, description, created_at);

      if (response.status === "success") {
        Alert.alert("✅ Success", "Homework added successfully!");
        setTitle("");
        setDescription("");
        loadHomework(); // refresh list
      } else {
        Alert.alert("Error", "Failed to add homework");
      }
    } catch (err) {
      console.error("❌ Error adding homework:", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render Homework Item
  const renderItem = ({ item }: { item: any }) => (
    <View className="p-4 bg-gray-100 rounded-lg mb-2">
      <Text className="text-lg font-bold text-black">{item.title}</Text>
      <Text className="text-gray-700">{item.description}</Text>
      <Text className="text-gray-500 text-xs mt-1">
        {dayjs(item.created_at).format("DD MMM YYYY")}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4 text-black">📚 Add Homework</Text>

      {/* ✅ Title Input */}
      <TextInput
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
        className="border border-gray-300 rounded-lg p-3 mb-3 text-black"
        placeholderTextColor="#999"
      />

      {/* ✅ Description Input */}
      <TextInput
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
        className="border border-gray-300 rounded-lg p-3 mb-3 text-black"
        placeholderTextColor="#999"
        multiline
      />

      {/* ✅ Add Button */}
      <TouchableOpacity
        onPress={handleAddHomework}
        disabled={loading}
        className={`${
          loading ? "bg-gray-400" : "bg-indigo-600"
        } py-3 rounded-xl mb-6`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-bold text-base">
            ➕ Add Homework
          </Text>
        )}
      </TouchableOpacity>

      {/* ✅ Homework List */}
      <Text className="text-lg font-semibold mb-3 text-black">
        📝 Latest Homework
      </Text>
      {refreshing ? (
        <ActivityIndicator size="small" color="#4F46E5" />
      ) : (
        <FlatList
          data={homeworkList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className="text-gray-500">No homework added yet.</Text>
          }
        />
      )}
    </View>
  );
};

export default Homework;
