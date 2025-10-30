// app/onboarding/slide2.tsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import sec_slide from "../../assets/images/sec_slide.png"; // <-- Use the downloaded image here

export default function Slide2() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-orange-100 justify-start items-center px-6 pt-[100px]">
   
      <Image
        source={sec_slide}
        className="w-full h-[370px] rounded-3xl mb-6"
        resizeMode="cover"
      />

    
      <Text className="text-4xl font-bold text-black text-center mb-3">
        📚 Learn & Grow
      </Text>


      <Text className="text-base text-gray-800 text-center leading-relaxed">
        Access notes, track attendance, receive notices,{"\n"}
        and stay informed – all in one powerful app!
      </Text>

    
      <TouchableOpacity
        className="mt-12 px-10 py-3 bg-black rounded-full shadow-md"
        onPress={() => router.push("/(auth)/login")}
      >
        <Text className="text-white text-base font-semibold">Get Started !!!</Text>
      </TouchableOpacity>
    </View>
  );
}
