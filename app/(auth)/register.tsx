import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { registerStudent } from "../../utils/api";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const res = await registerStudent(name, email, password);

      if (res?.success === false) {
        Alert.alert("Error", res.message || "Registration failed");
        return;
      }

      Alert.alert("Success", "Registration successful!");
      router.replace("/(auth)/login");
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error.message || "Something went wrong";
      Alert.alert("Registration Failed", message);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-center text-black mb-8">
        Create an Account
      </Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#9CA3AF"
        className="border border-gray-300 rounded-xl w-full px-4 py-3 mb-4 text-black"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        className="border border-gray-300 rounded-xl w-full px-4 py-3 mb-4 text-black"
        onChangeText={setEmail}
        value={email}
      />

      <View className="relative mb-6">
        <TextInput
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          className="border border-gray-300 rounded-xl w-full px-4 py-3 pr-12 text-black"
          onChangeText={setPassword}
          value={password}
        />
        <Pressable
          className="absolute right-4 top-3.5"
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#6B7280"
          />
        </Pressable>
      </View>

      <TouchableOpacity
        className="bg-black rounded-xl w-full py-3"
        onPress={handleRegister}
      >
        <Text className="text-white text-center font-semibold text-base">
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        className="mt-6"
      >
        <Text className="text-gray-600 text-center">
          Already have an account?{" "}
          <Text className="text-black font-semibold">Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
