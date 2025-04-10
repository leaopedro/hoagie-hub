import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HoagieListScreen from "./screens/HoagieListScreen";
import { UserProvider } from "./context/UserContext";
import CreateHoagieScreen from "./screens/CreateHoagieScreen";

export type RootStackParamList = {
  Login: undefined;
  Hoagies: undefined;
  CreateHoagie: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Hoagies"
            component={HoagieListScreen}
            options={{ title: "Hoagies" }}
          />
          <Stack.Screen
            name="CreateHoagie"
            component={CreateHoagieScreen}
            options={{ title: "New Hoagie" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
