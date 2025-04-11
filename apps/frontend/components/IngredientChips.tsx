import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

type IngredientChipsProps = {
  ingredients: string[];
  onClose?: (ing: string) => void;
};

const IngredientChips: React.FC<IngredientChipsProps> = ({
  ingredients,
  onClose,
}) => {
  return (
    <View style={styles.chipsContainer}>
      {ingredients.map((ingredient) => {
        const chipProps = {
          style: styles.chip,
        };
        if (onClose) chipProps.onClose = () => onClose(ingredient);
        return (
          <Chip key={ingredient} {...chipProps}>
            {ingredient}
          </Chip>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  chip: { marginRight: 6, marginBottom: 6 },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    marginTop: 12,
  },
});

export default IngredientChips;
