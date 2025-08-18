import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginStudent } from "../../utils/api"; // your custom API function

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "All fields are required");
    return;
  }

  setLoading(true);
  try {
    const res = await loginStudent(email, password);

    const data = res.data;
    // ✅ Save first, then navigate
    await AsyncStorage.setItem("isLoggedIn", "true");
    await AsyncStorage.setItem("userData", JSON.stringify(res)); 


    console.log("✅ Saved isLoggedIn & userData");

    Alert.alert("Success", "Login successful");

    // ✅ Redirect based on user type
    if (res?.type === "admin") {
      router.replace("/(teacher)/teacherDashboard");
    } else if (res?.type === "student") {
      router.replace("/(users)/userdashboard");
    } else {
      Alert.alert("Error", "Invalid user type");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    Alert.alert("Login Failed", error.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};


  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold text-center mb-8 text-black">
        Welcome Back 👋
      </Text>

      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Email</Text>
        <TextInput
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 rounded-xl p-4 bg-white text-black"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Password</Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl bg-white px-3">
          <TextInput
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            className="flex-1 p-4 text-black"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        className={`py-4 rounded-xl shadow-md mb-4 ${
          loading ? "bg-gray-400" : "bg-black"
        }`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold text-base">
            Login
          </Text>
        )}
      </TouchableOpacity>

      {/* Navigate to Register */}
      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text className="text-center text-gray-600">
          Don’t have an account?{" "}
          <Text className="text-black font-semibold">Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
