import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

type Comment = {
  _id: string;
  text: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
};

type Props = {
  comments: Comment[];
  loading: boolean;
};

export default function CommentList({ comments, loading }: Props) {
  if (loading) return <ActivityIndicator />;

  if (comments.length === 0) {
    return <Text style={styles.subtle}>No comments yet.</Text>;
  }

  return (
    <>
      {comments.map((c) => (
        <Card key={c._id} style={styles.card}>
          <Card.Content>
            <Text style={styles.user}>{c.user.name}</Text>
            <Text>{c.text}</Text>
          </Card.Content>
        </Card>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    backgroundColor: "#f7f7f7",
  },
  user: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtle: {
    color: "#888",
    fontStyle: "italic",
    marginTop: 4,
  },
});
