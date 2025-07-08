import { router } from "expo-router";
import { FlatList, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const pages = [
    { href: '/', title: 'Start Game' },
    { href: '/history', title: 'History' },
    { href: '/summary', title: 'Summary' },
    { href: '/settings', title: 'Settings' },
  ];

  const handlePress = (href:any) => {
    router.push(href);
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-[#000012]">
      <FlatList
        data={pages}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => handlePress(item.href)} 
            className="bg-blue-500 px-4 py-2 rounded-lg w-[60vw]"
          >
            <Text 
              style={{ fontFamily: "Poppins_600SemiBold" }} 
              className="text-2xl text-white text-center"
            >
              {item.title}
            </Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.href}
        contentContainerStyle={{
          gap: 15,
          justifyContent: 'center', 
          flexGrow: 1,
        }}
      />
    </SafeAreaView>
  );
}
