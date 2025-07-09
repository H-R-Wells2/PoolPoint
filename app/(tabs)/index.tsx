import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

export default function Index() {

  const pages = [
    { href: '/new-game', title: 'New Game' },
    { href: '/team-game', title: 'Team Game' },
    { href: '/history', title: 'History' },
    { href: '/settings', title: 'Settings' },
  ];

  const handlePress = (href:any) => {
    router.push(href);
  };

  return (
    <View className="flex-1 items-center bg-[#111827]">
      <FlatList
        data={pages}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => handlePress(item.href)} 
            className="bg-teal-500 px-4 py-2.5 rounded-lg w-[60vw]"
          >
            <Text 
              style={{ fontFamily: "Poppins_600SemiBold" }} 
              className="text-lg text-white text-center"
            >
              {item.title}
            </Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.href}
        contentContainerStyle={{
          gap: 15,
          flexGrow: 1,
          paddingTop: 150
        }}
      />
    </View>
  );
}
