import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TextInput
        label="Add a comment"
        mode="outlined"
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!text.trim()}
        style={styles.button}
      >
        Post Comment
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    marginBottom: 16,
  },
});
