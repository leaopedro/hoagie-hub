import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text, HelperText, Chip } from "react-native-paper";
import { useUser } from "../context/UserContext";
import { createApi } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

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

  const { user } = useUser();
  const api = createApi(user ?? undefined);
  const navigation = useNavigation<NavigationProp>();

  const addIngredient = () => {
    setError("");
    if (!ingredient.trim()) return;
    if (ingredients.includes(ingredient.trim())) {
      setError("Repeated ingredient");
      return;
    }

    setIngredients([...ingredients, ingredient.trim()]);
    setIngredient("");
  };

  const removeIngredient = (toRemove: string) => {
    setIngredients((prev) => prev.filter((ing) => ing !== toRemove));
  };

  const handleSubmit = async () => {
    if (!name.trim() || ingredients.length === 0) {
      setError("Name and at least one ingredient are required.");
      return;
    }

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
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TextInput
        label="Hoagie Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <Text variant="titleSmall" style={styles.label}>
        Ingredients
      </Text>
      <View style={styles.chipsContainer}>
        {ingredients.map((ing) => (
          <Chip
            key={ing}
            style={styles.chip}
            onClose={() => removeIngredient(ing)}
          >
            {ing}
          </Chip>
        ))}
      </View>

      <View style={styles.row}>
        <TextInput
          label="Add Ingredient"
          value={ingredient}
          onChangeText={setIngredient}
          mode="outlined"
          style={[styles.input, { flex: 1 }]}
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
        onChangeText={setImage}
        mode="outlined"
        style={styles.input}
      />

      {error ? (
        <HelperText type="error" visible={true}>
          {error}
        </HelperText>
      ) : null}

      <Button mode="contained" onPress={handleSubmit}>
        Create Hoagie
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  input: { marginBottom: 12 },
  label: { marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  addBtn: { marginLeft: 8, alignSelf: "stretch", justifyContent: "center" },
  chip: { marginRight: 6, marginBottom: 6 },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
});
