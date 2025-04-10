import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { useUser } from "../context/UserContext";
import { createApi } from "../services/api";
import { useNavigation } from "@react-navigation/native";

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
      <View style={styles.card}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>Created by: {item.creator.name}</Text>
        <Text style={styles.meta}>
          Ingredients: {item.ingredients.join(", ")}
        </Text>
        <Text style={styles.meta}>Comments: {item.commentCount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button
        title="New Hoagie"
        onPress={() => navigation.navigate("CreateHoagie" as never)}
      />
      <FlatList
        data={hoagies}
        renderItem={renderHoagie}
        keyExtractor={(item) => item._id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  meta: { fontSize: 14, color: "#555", marginBottom: 2 },
});
