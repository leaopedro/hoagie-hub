import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { useApi } from "../hooks/useApi";
import CommentInput from "../components/CommentInput";
import CommentList from "../components/CommentList";

type Hoagie = {
  _id: string;
  name: string;
  ingredients: string[];
  image?: string;
  creator: { name: string; email: string };
  commentCount: number;
};

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

export default function HoagieDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "HoagieDetail">>();
  const api = useApi();
  const { hoagieId } = route.params;

  const [hoagie, setHoagie] = useState<Hoagie | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/hoagies/${hoagieId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };
  useEffect(() => {
    const fetchHoagie = async () => {
      try {
        const res = await api.get(`/hoagies/${hoagieId}`);
        setHoagie(res.data);
      } catch (err) {
        console.error("Error fetching hoagie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHoagie();
    fetchComments();
  }, [hoagieId]);

  if (loading || !hoagie) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {hoagie.image && (
        <Image source={{ uri: hoagie.image }} style={styles.image} />
      )}
      <Text style={styles.name}>{hoagie.name}</Text>
      <Text style={styles.creator}>By: {hoagie.creator.name}</Text>
      <Text style={styles.label}>Ingredients:</Text>
      <Text style={styles.text}>{hoagie.ingredients.join(", ")}</Text>

      <Text style={styles.label}>Comments:</Text>
      <CommentInput hoagieId={hoagieId} onCommentPosted={() => fetchComments()} />
      <CommentList comments={comments} loading={loadingComments} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { height: 200, borderRadius: 12, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  creator: { fontSize: 14, color: "#888", marginBottom: 16 },
  label: { fontWeight: "bold", marginTop: 12, marginBottom: 4 },
  text: { fontSize: 16, color: "#333" },
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
