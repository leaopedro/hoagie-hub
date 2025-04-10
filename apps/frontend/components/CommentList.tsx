import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

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
  if (loading) {
    return <ActivityIndicator />;
  }

  if (comments.length === 0) {
    return <Text style={styles.subtle}>No comments yet.</Text>;
  }

  return (
    <>
      {comments.map((c) => (
        <View key={c._id} style={styles.commentBox}>
          <Text style={styles.commentUser}>{c.user.name}</Text>
          <Text>{c.text}</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  commentBox: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    marginTop: 8,
  },
  commentUser: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtle: {
    color: "#888",
    fontStyle: "italic",
    marginTop: 4,
  },
});
