import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function TeacherTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: "#F8FAFC",
          borderTopWidth: 0.5,
          borderTopColor: "#E5E7EB",
        },
      }}
    >
      <Tabs.Screen
        name="teacherDashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendence"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event-available" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
  name="addStudent"
  options={{
    title: "Add Student",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person-add-outline" size={size} color={color} />
    ),
  }}
/>
      
      <Tabs.Screen
        name="notice"
        options={{
          title: "Notices",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="homework"
        options={{
          title: "Homework",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="book-open" size={size} color={color} />
          ),
        }}
      /> 
        <Tabs.Screen
        name="EditStudentsScreen"
        options={{
          title: "EditStudent",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
