import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useApi } from "../hooks/useApi";

type Props = {
  hoagieId: string;
  onCommentPosted: () => void;
};

export default function CommentInput({ hoagieId, onCommentPosted }: Props) {
  const [text, setText] = useState("");
  const api = useApi();

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      await api.post("/comments", {
        hoagieId,
        text: text.trim(),
      });

      setText("");
      onCommentPosted();
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        value={text}
        onChangeText={setText}
      />
      <Button title="Post Comment" onPress={handleSubmit} disabled={!text.trim()} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    marginTop: 16,
  },
});
