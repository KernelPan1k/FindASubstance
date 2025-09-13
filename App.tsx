import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import IndexScreen from "./screens/IndexScreen";
import DetailScreen from "./screens/DetailScreen";
import InteractionScreen from "./screens/InteractionScreen";

export type RootStackParamList = {
    Home: undefined;
    Detail: { substance: any };
};

export type RootTabParamList = {
    SearchTab: undefined;
    InteractionsTab: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function SearchStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#000" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
            }}
        >
            <Stack.Screen
                name="Home"
                component={IndexScreen}
                options={{ title: "Search a substance" }}
            />
            <Stack.Screen
                name="Detail"
                component={DetailScreen}
                options={{ title: "Substance details" }}
            />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarStyle: { backgroundColor: "#111" },
                        tabBarActiveTintColor: "#0af",
                        tabBarInactiveTintColor: "#888",
                        tabBarIcon: ({ color, size }) => {
                            let iconName: keyof typeof Ionicons.glyphMap = "search";
                            if (route.name === "SearchTab") {
                                iconName = "search";
                            } else if (route.name === "InteractionsTab") {
                                iconName = "swap-horizontal";
                            }
                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                    })}
                >
                    <Tab.Screen
                        name="SearchTab"
                        component={SearchStack}
                        options={{ title: "Search" }}
                    />
                    <Tab.Screen
                        name="InteractionsTab"
                        component={InteractionScreen}
                        options={{ title: "Interactions" }}
                    />
                </Tab.Navigator>
            </NavigationContainer>

            <View
                style={{
                    paddingVertical: 6,
                    borderTopWidth: 1,
                    borderTopColor: "#222",
                    backgroundColor: "#000",
                }}
            >
                <Text
                    style={{
                        color: "#666",
                        fontSize: 12,
                        textAlign: "center",
                    }}
                >
                    Data provided by TripSit (https://tripsit.me)
                </Text>
            </View>
        </View>
    );
}
