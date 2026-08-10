import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown : false ,
                tabBarStyle: {
                    backgroundColor: "#6B7280" ,
                    borderTopColor : "#6B7280"
                },
                tabBarActiveTintColor: "#14F195" ,
                tabBarInactiveTintColor : "#FFFFFF"
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Wallet" ,
                    tabBarIcon : ({ color, size }) => (
                        <Ionicons name={"wallet"} size={size} color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name={"swap"}
                options={{
                    title: "Swap" ,
                    tabBarIcon : ({ color, size }) => (
                        <Ionicons name={"swap-horizontal"} size={size} color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name={"explore"}
                options={{
                    title: "Explore" ,
                    tabBarIcon : ({ color, size }) => (
                        <Ionicons name={"compass"} size={size} color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name={"settings"}
                options={{
                    title: "Settings" ,
                    tabBarIcon : ({ color, size }) => (
                        <Ionicons name={"settings"} size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    )
}