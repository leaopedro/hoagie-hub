import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { useApi } from "../hooks/useApi";
import CommentInput from "../components/CommentInput";
import CommentList from "../components/CommentList";
import { Text, Card, Divider, Chip } from "react-native-paper";
import Animated, { SlideInRight } from "react-native-reanimated";
import IngredientChips from "../components/IngredientChips";

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
  const [imageFailed, setImageFailed] = useState(false);

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

  const imageSource = {
    uri: hoagie.image ?? "https://placehold.co/400x200?text=Hoagie",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={SlideInRight}>
        <Card>
          <Card.Cover
            source={imageSource}
            style={styles.image}
            onError={() => setImageFailed(true)}
          />
          <Card.Content>
            <Text variant="headlineMedium" style={styles.name}>
              {hoagie.name}
            </Text>
            <Text style={styles.creator}>By: {hoagie.creator.name}</Text>

            <Divider style={{ marginVertical: 12 }} />

            <Text variant="titleSmall" style={styles.label}>
              Ingredients:
            </Text>
            <IngredientChips ingredients={hoagie.ingredients} />
            <Divider style={{ marginVertical: 12 }} />

            <Text variant="titleSmall" style={styles.label}>
              Comments:
            </Text>
            <CommentInput hoagieId={hoagieId} onCommentPosted={fetchComments} />
            <CommentList comments={comments} loading={loadingComments} />
          </Card.Content>
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 200,
  },
  name: {
    marginTop: 12,
  },
  creator: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
