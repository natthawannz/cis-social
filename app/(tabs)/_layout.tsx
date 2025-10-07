import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";

function SafeTabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#0b0b0b' },
      headerTitleStyle: { color: '#ECEDEE', fontWeight: '800' },
      headerTintColor: '#f5c542',

    tabBarStyle: {
      backgroundColor: '#0b0b0b',
      borderTopColor: '#2a2f34',
      height: 58,
      paddingBottom: 6,
      paddingTop: 6,
    },
    tabBarActiveTintColor: '#f5c542',
    tabBarInactiveTintColor: '#9BA1A6',
  }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "หน้าหลัก",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "ฟีด",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: "สมาชิก",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "โปรไฟล์",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Fallback component สำหรับกรณีที่ Auth ยังไม่พร้อม
function LoadingTabs() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "หน้าหลัก",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "โปรไฟล์",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  try {
    return <SafeTabLayout />;
  } catch (error) {
    console.warn("Auth not ready, using fallback layout");
    return <LoadingTabs />;
  }
}
