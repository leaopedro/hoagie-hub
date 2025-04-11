import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";
import Animated, { FadeIn } from "react-native-reanimated";

type Props = {
  ingredients: string[];
  onClose?: (ingredient: string) => void;
};

export default function IngredientChips({ ingredients, onClose }: Props) {
  return (
    <View style={styles.container}>
      {ingredients.map((ingredient) => (
        <Animated.View
          key={ingredient}
          entering={FadeIn}
          style={styles.chipWrapper}
        >
          <Chip onClose={onClose ? () => onClose(ingredient) : undefined}>
            {ingredient}
          </Chip>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    marginTop: 12,
  },
  chipWrapper: {
    marginRight: 6,
    marginBottom: 6,
    maxWidth: "80vw",
  },
});
