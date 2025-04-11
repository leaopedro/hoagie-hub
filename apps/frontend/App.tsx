import React from "react";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HoagieListScreen from "./screens/HoagieListScreen";
import { UserProvider } from "./context/UserContext";
import CreateHoagieScreen from "./screens/CreateHoagieScreen";
import HoagieDetailScreen from "./screens/HoagieDetailScreen";
import Logo from "./assets/horizontal-logo.png";

export type RootStackParamList = {
  Login: undefined;
  Hoagies: undefined;
  CreateHoagie: undefined;
  HoagieDetail: { hoagieId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const topBarOptions = {
  headerTitleAlign: "center",
  headerTitle: () => (
    <Image
      source={Logo}
      style={{ height: 120, width: 120, resizeMode: "contain" }}
    />
  ),
};

export default function App() {
  return (
    <UserProvider>
      <PaperProvider theme={DefaultTheme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Hoagies"
              component={HoagieListScreen}
              options={topBarOptions}
            />
            <Stack.Screen
              name="CreateHoagie"
              component={CreateHoagieScreen}
              options={topBarOptions}
            />
            <Stack.Screen
              name="HoagieDetail"
              component={HoagieDetailScreen}
              options={topBarOptions}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}
