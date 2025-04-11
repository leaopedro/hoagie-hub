import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, Text, Button } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import IngredientChips from "./IngredientChips";

type Hoagie = {
  _id: string;
  name: string;
  ingredients: string[];
  image?: string;
  creator: {
    name: string;
    email: string;
  };
  commentCount: number;
};

export default function HoagieCard({ hoagie }: { hoagie: Hoagie }) {
  const navigation = useNavigation();

  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("HoagieDetail", { hoagieId: hoagie._id })
        }
      >
        <Card style={styles.card}>
          <Image
            source={{
              uri: hoagie.image ?? "https://placehold.co/400x200?text=Hoagie",
            }}
            style={styles.image}
          />
          <Card.Content>
            <Text variant="titleMedium" style={styles.name}>
              {hoagie.name}
            </Text>
            <Text style={styles.meta}>Created by: {hoagie.creator.name}</Text>
            <IngredientChips ingredients={hoagie.ingredients} />
            <Button
              icon="comment"
              style={styles.commentButton}
              onPress={() =>
                navigation.navigate("HoagieDetail", { hoagieId: hoagie._id })
              }
            >
              {hoagie.commentCount}
            </Button>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
  },
  name: {
    marginTop: 10,
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  commentButton: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
});
