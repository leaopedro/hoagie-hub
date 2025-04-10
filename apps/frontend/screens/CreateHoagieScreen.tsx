import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
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
    if (ingredients.includes(ingredient)) {
      setError("Repeated ingredient");
      return;
    }
    if (ingredient.trim()) {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient("");
    }
  };

  const removeIngredient = (toRemove) => {
    const newIngredients = ingredients.filter((ing) => ing !== toRemove);
    setIngredients(newIngredients);
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
    <View style={styles.container}>
      <Text style={styles.label}>Hoagie Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Ingredients</Text>
      <FlatList
        data={ingredients}
        renderItem={({ item }) => {
          return (
            <>
              <Text style={styles.ingredient}>{item}</Text>{" "}
              <button onClick={() => removeIngredient(item)}>X</button>
            </>
          );
        }}
        keyExtractor={(item, index) => `${item}-${index}`}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={ingredient}
          onChangeText={setIngredient}
          placeholder="Add ingredient"
        />
        <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Image URL (optional)</Text>
      <TextInput style={styles.input} value={image} onChangeText={setImage} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Create Hoagie" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  label: { fontWeight: "bold", marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  addButton: {
    marginLeft: 8,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 4,
  },
  addText: { color: "white", fontWeight: "bold" },
  ingredient: { fontSize: 14, color: "#444", marginBottom: 4 },
  error: { color: "red", marginBottom: 12, textAlign: "center" },
});
