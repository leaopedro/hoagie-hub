import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { useUser } from "../context/UserContext";
import { createApi } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Animated, { SlideInDown } from "react-native-reanimated";
import IngredientChips from "../components/IngredientChips";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateHoagie"
>;

export default function CreateHoagieScreen() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();
  const api = createApi(user ?? undefined);
  const navigation = useNavigation<NavigationProp>();

  const addIngredient = () => {
    const trimmed = ingredient.trim();
    if (!trimmed) return;
    if (ingredients.includes(trimmed)) {
      setError("Repeated ingredient");
      return;
    }
    setIngredients([...ingredients, trimmed]);
    setIngredient("");
    setError("");
  };

  const removeIngredient = (toRemove: string) => {
    setIngredients((prev) => prev.filter((ing) => ing !== toRemove));
  };

  const handleSubmit = async () => {
    setError("");
    if (!name.trim() || ingredients.length === 0) {
      setError("Name and at least one ingredient are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/hoagies", {
        name: name.trim(),
        ingredients,
        image: image.trim() || undefined,
      });
      navigation.replace("Hoagies");
    } catch (err) {
      console.error(err);
      setError("Failed to create hoagie. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Animated.View entering={SlideInDown.springify()}>
        <TextInput
          label="Hoagie Name"
          value={name}
          onChangeText={(t) => setName(t)}
          mode="outlined"
          style={styles.input}
        />

        <Text variant="titleSmall" style={styles.label}>
          Ingredients
        </Text>

        <IngredientChips ingredients={ingredients} onClose={removeIngredient} />

        <View style={styles.row}>
          <TextInput
            label="Add Ingredient"
            value={ingredient}
            onChangeText={(t) => setIngredient(t)}
            mode="outlined"
            style={styles.ingredientInput}
          />
          <Button
            mode="contained-tonal"
            onPress={addIngredient}
            style={styles.addBtn}
          >
            + Add
          </Button>
        </View>

        <TextInput
          label="Image URL (optional)"
          value={image}
          onChangeText={(t) => setImage(t)}
          mode="outlined"
          style={styles.input}
        />

        {!!error && (
          <HelperText type="error" visible={true}>
            {error}
          </HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Create Hoagie
        </Button>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ingredientInput: {
    flex: 1,
    marginBottom: 12,
  },
  addBtn: {
    marginLeft: 8,
    alignSelf: "stretch",
    justifyContent: "center",
  },
});
