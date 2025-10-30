import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAllHomework, deleteHomework } from '../utils/api'; 
import dayjs from 'dayjs'; 
const HomeworkList = () => {
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    try {
      setLoading(true);
      const data = await getAllHomework();
      setHomeworkList(data);
    } catch (error) {
      console.error('❌ Error fetching homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this homework?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHomework(id);
              Alert.alert("Success", "Homework deleted successfully");
              fetchHomework(); // refresh list
            } catch (error) {
              Alert.alert("Error", "Failed to delete homework");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-gray-100 p-4 rounded-xl mb-3">
      <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
      <Text className="text-gray-700 mt-1">{item.description}</Text>
      <Text className="text-xs text-gray-500 mt-2">
        {dayjs(item.created_at).format('DD MMM YYYY, hh:mm A')}
      </Text>

      
      <TouchableOpacity
        className="bg-red-600 px-3 py-1 rounded mt-2 self-start"
        onPress={() => handleDelete(item.id)}
      >
        <Text className="text-white text-sm font-bold">Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-600 mt-2">Loading Homework...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4 text-center">Homework List</Text>
      {homeworkList.length === 0 ? (
        <Text className="text-center text-gray-600">No homework available</Text>
      ) : (
        <FlatList
          data={homeworkList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default HomeworkList;
