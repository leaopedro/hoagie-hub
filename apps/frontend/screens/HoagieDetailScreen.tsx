import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { useApi } from "../hooks/useApi";
import CommentInput from "../components/CommentInput";
import CommentList from "../components/CommentList";
import { Text, Card, Divider } from "react-native-paper";
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

const PLACEHOLDER_IMAGE = "https://placehold.co/400x200?text=Hoagie";

export default function HoagieDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "HoagieDetail">>();
  const { hoagieId } = route.params;
  const api = useApi();

  const [hoagie, setHoagie] = useState<Hoagie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get(`/hoagies/${hoagieId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  }, [api, hoagieId]);

  const fetchHoagie = useCallback(async () => {
    try {
      const res = await api.get(`/hoagies/${hoagieId}`);
      setHoagie(res.data);
    } catch (err) {
      console.error("Error fetching hoagie:", err);
    } finally {
      setLoading(false);
    }
  }, [api, hoagieId]);

  useEffect(() => {
    fetchHoagie();
    fetchComments();
  }, [fetchHoagie, fetchComments]);

  if (loading || !hoagie) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const imageSource: ImageSourcePropType = {
    uri: imageFailed ? PLACEHOLDER_IMAGE : (hoagie.image ?? PLACEHOLDER_IMAGE),
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

            <Divider style={styles.divider} />

            <Text variant="titleSmall" style={styles.label}>
              Ingredients:
            </Text>
            <IngredientChips ingredients={hoagie.ingredients} />

            <Divider style={styles.divider} />

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
  divider: {
    marginVertical: 12,
  },
});
