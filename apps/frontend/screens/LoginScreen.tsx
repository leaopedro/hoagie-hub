import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  TextInput,
  Button,
  Text,
  HelperText,
  Avatar,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useUser } from "../context/UserContext";
import { useApi } from "../hooks/useApi";
import Logo from "../assets/logo.png";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { user, setUser } = useUser();
  const api = useApi();

  if (user) navigation.replace("Hoagies");

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!isSignup) {
      try {
        const res = await api.post("/auth/login", { email });
        setUser(res.data);
        navigation.replace("Hoagies");
      } catch (err: any) {
        if (err.response?.data?.statusCode === 401) {
          setIsSignup(true);
        } else {
          setError(
            "Login failed. Please check your connection or try again later.",
          );
        }
        setIsLoading(false);
        return;
      }
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const signupRes = await api.post("/auth/signup", { email, name });
      setUser(signupRes.data);
      navigation.replace("Hoagies");
    } catch (err: any) {
      setError(
        "Signup failed. Please check your connection or try again later.",
      );
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <TextInput
        label="Email"
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {isSignup && (
        <TextInput
          label="Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      )}

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={isLoading}
        disabled={isLoading}
      >
        Continue
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  input: { marginBottom: 12 },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 24,
  },
});
