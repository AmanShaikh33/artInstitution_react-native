import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  addNotice,
  fetchAllNotices,
  updateNotice,
  deleteNotice,
} from "../../utils/api";

export default function NoticeScreen() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const data = await fetchAllNotices();
      setNotices(data.reverse());
    } catch (err) {
      Alert.alert("Error", "Could not fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Title is required");
      return;
    }

    const noticeData = {
      title,
      description,
      category: "general", // default category
      priority: "normal", // default priority
      status: "draft", // default status
      created_at: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    };

    try {
      if (editId) {
        await updateNotice(editId, noticeData);
        Alert.alert("✅", "Notice updated successfully");
      } else {
        await addNotice(noticeData);
        Alert.alert("✅", "Notice added successfully");
      }

      setTitle("");
      setDescription("");
      setEditId(null);
      loadNotices();
    } catch (err) {
      Alert.alert("❌", "Failed to submit notice");
    }
  };

  const handleEdit = (notice: any) => {
    setTitle(notice.title);
    setDescription(notice.description);
    setEditId(notice.id);
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Confirm", "Are you sure you want to delete this notice?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteNotice(id);
            Alert.alert("✅", "Notice deleted");
            loadNotices();
          } catch {
            Alert.alert("❌", "Failed to delete notice");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4 text-black">📢 Notices</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        className="border border-gray-300 rounded-lg px-3 py-2 mb-2 text-black"
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        className="border border-gray-300 rounded-lg px-3 py-2 mb-2 text-black"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-indigo-600 py-3 rounded-lg mb-4"
      >
        <Text className="text-white text-center font-bold">
          {editId ? "✏️ Update Notice" : "➕ Add Notice"}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : (
        <FlatList
          data={notices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="border-b border-gray-200 py-3">
              <Text className="font-bold text-lg">{item.title}</Text>
              <Text className="text-gray-600 mb-1">{item.description}</Text>
              <Text className="text-xs text-gray-400 mb-2">
                {new Date(item.created_at).toLocaleString()}
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  className="bg-yellow-500 px-3 py-1 rounded"
                >
                  <Text className="text-white font-semibold">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  <Text className="text-white font-semibold">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
