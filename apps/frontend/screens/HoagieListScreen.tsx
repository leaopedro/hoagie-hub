import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useUser } from "../context/UserContext";
import { createApi } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, Card, FAB } from "react-native-paper";

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

export default function HoagieListScreen() {
  const { user } = useUser();
  const navigation = useNavigation();
  const [hoagies, setHoagies] = useState<Hoagie[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const fetchHoagies = async (offsetValue: number) => {
    if (!user) return;
    const api = createApi(user);
    try {
      setLoading(true);
      const res = await api.get(
        `/hoagies?limit=${limit}&offset=${offsetValue}`,
      );
      if (offsetValue === 0) {
        setHoagies(res.data.data);
      } else {
        setHoagies((prev) => [...prev, ...res.data.data]);
      }
      setTotal(res.data.total);
    } catch (err) {
      console.error("Failed to load hoagies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHoagies(0);
      setOffset(0);
    }
  }, [user]);

  useEffect(() => {
    if (user && offset > 0) {
      fetchHoagies(offset);
    }
  }, [offset]);

  const loadMore = () => {
    if (!loading && hoagies.length < total) {
      setOffset((prev) => prev + limit);
    }
  };

  const renderHoagie = ({ item }: { item: Hoagie }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("HoagieDetail", { hoagieId: item._id })
      }
    >
      <Card style={styles.card}>
        <Image
          source={{
            uri: item.image ?? "https://placehold.co/400x200?text=Hoagie",
          }}
          style={styles.image}
        />
        <Card.Content>
          <Text variant="titleMedium" style={styles.name}>
            {item.name}
          </Text>
          <Text style={styles.meta}>Created by: {item.creator.name}</Text>
          <Text style={styles.meta}>
            Ingredients: {item.ingredients.join(", ")}
          </Text>
          <Text style={styles.meta}>Comments: {item.commentCount}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={hoagies}
        renderItem={renderHoagie}
        keyExtractor={(item) => item._id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" /> : null
        }
        contentContainerStyle={{ paddingBottom: 96 }}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        label="New Hoagie"
        onPress={() => navigation.navigate("CreateHoagie" as never)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
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
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
