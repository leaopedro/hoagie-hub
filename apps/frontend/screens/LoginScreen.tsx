import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useUser } from "../context/UserContext";
import { useApi } from "../hooks/useApi";
import Logo from "../assets/logo.png";

import Animated, { FadeIn, FadeInDown, Layout } from "react-native-reanimated";

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
  const [showForm, setShowForm] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { user, setUser } = useUser();
  const api = useApi();

  useEffect(() => {
    if (user) {
      navigation.replace("Hoagies");
    }
  }, [user]);

  useEffect(() => {
    const timeout = setTimeout(() => setShowForm(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }

      if (!isSignup) {
        const res = await api.post("/auth/login", { email });
        setUser(res.data);
        return;
      }

      if (name.trim().length < 2) {
        throw new Error("Name must be at least 2 characters.");
      }

      const signupRes = await api.post("/auth/signup", { email, name });
      setUser(signupRes.data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.statusCode === 401
          ? (setIsSignup(true), "")
          : err?.message || "Login failed. Please try again later.";
      if (msg) setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Animated.Image
            entering={FadeIn.duration(600)}
            layout={Layout.springify()}
            source={Logo}
            style={styles.logo}
          />

          {showForm && (
            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
              <View style={styles.form}>
                <Pressable
                  onPress={() => {
                    if (isSignup) {
                      setIsSignup(false);
                      setName("");
                    }
                  }}
                >
                  <TextInput
                    label="Email"
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    disabled={isSignup}
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    style={styles.input}
                  />
                </Pressable>

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
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  form: {
    marginTop: 12,
  },
  input: {
    marginBottom: 12,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
