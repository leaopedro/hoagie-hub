import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FAB } from "react-native-paper";

import { useUser } from "../context/UserContext";
import { createApi } from "../services/api";
import HoagieCard from "../components/HoagieCard";

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

const PAGE_SIZE = 5;

export default function HoagieListScreen() {
  const { user } = useUser();
  const navigation = useNavigation();

  const [hoagies, setHoagies] = useState<Hoagie[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchHoagies = async (offsetValue: number) => {
    if (!user) return;
    const api = createApi(user);

    if (offsetValue === 0) setHoagies([]);

    try {
      setLoading(true);
      const res = await api.get(
        `/hoagies?limit=${PAGE_SIZE}&offset=${offsetValue}`,
      );
      const newHoagies = res.data.data;
      setTotal(res.data.total);
      setHoagies((prev) =>
        offsetValue === 0 ? newHoagies : [...prev, ...newHoagies],
      );
    } catch (err) {
      console.error("Failed to load hoagies", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchHoagies(0);
        setOffset(0);
      }
    }, [user]),
  );

  useEffect(() => {
    if (user && offset > 0) {
      fetchHoagies(offset);
    }
  }, [offset]);

  const loadMore = () => {
    if (!loading && hoagies.length < total) {
      setOffset((prev) => prev + PAGE_SIZE);
    }
  };

  const listFooter = useMemo(
    () => (loading ? <ActivityIndicator size="small" /> : null),
    [loading],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={hoagies}
        renderItem={({ item }) => <HoagieCard hoagie={item} />}
        keyExtractor={(item) => item._id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={listFooter}
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
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
