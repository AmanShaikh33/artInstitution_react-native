import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import art_institution from '../../assets/images/art_institution.png';

export default function Slide1() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-100 to-pink-200 px-6 justify-start items-center pt-12 mt-10">
      {/* Full-width tall image */}
      <Image
         source={art_institution}
        className="w-full h-[370px] rounded-3xl mb-6"
        resizeMode="cover"
      />

      {/* Main welcome message */}
      <Text className="text-4xl font-bold text-black text-center mb-4">
        Welcome to Kala Academy 
      </Text>

      {/* Description */}
      <Text className="text-base text-gray-800 text-center leading-relaxed">
        Discover your artistic journey with us.{"\n"}
        Explore Bharatanatyam, Indian classical music,{"\n"}
        and fine arts – all in one vibrant learning space.
      </Text>

      {/* Button */}
      <TouchableOpacity
        className="mt-12 px-10 py-3 bg-black rounded-full shadow-lg"
        onPress={() => router.push("/(onboarding)/slide2")}
      >
        <Text className="text-white text-base font-semibold">Get Started →</Text>
      </TouchableOpacity>
    </View>
  );
}
