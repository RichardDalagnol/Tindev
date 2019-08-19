import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import itsamatch from "../assets/itsamatch.png";

import asyncStorage from "@react-native-community/async-storage";
import api from "../services/api";
import io from "socket.io-client";

export default function Main({ navigation }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);
  const id = navigation.getParam("user");
  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/devs", {
        headers: {
          user: id
        }
      });
      setUsers(response.data);
    }

    loadUsers();
  }, [id]);

  useEffect(() => {
    const socket = io("http://localhost:3333", {
      query: { user: id }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
    });
  }, [id]);

  async function Like() {
    const [user, ...rest] = users;
    await api.post(`/devs/${user._id}/like`, null, {
      headers: { user: id }
    });
    setUsers(rest);
  }

  async function DisLike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislike`, null, {
      headers: { user: id }
    });

    setUsers(rest);
  }

  async function Logout() {
    await asyncStorage.clear();
    navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={Logout}>
        <Image source={logo} />
      </TouchableOpacity>
      <View style={styles.cardContainer}>
        {users.length === 0 ? (
          <Text style={styles.empty}>Acabou :(</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={user._id}
              style={[styles.card, { zIndex: users.length - index }]}
            >
              <Image style={styles.cardImage} source={{ uri: user.avatar }} />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio}>{user.bio}</Text>
              </View>
            </View>
          ))
        )}
      </View>
      {users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={DisLike}>
            <Image source={dislike} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={Like}>
            <Image source={like} />
          </TouchableOpacity>
        </View>
      )}

      {matchDev && (
        <View style={styles.matchContainer}>
          <Image source={itsamatch} />
          <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>
          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.closeMatch}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-between"
  },
  cardContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    maxHeight: 500
  },
  card: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    margin: 30,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  cardImage: {
    flex: 1,
    height: 300
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },

  bio: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    lineHeight: 18
  },

  logo: {
    marginTop: 30
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 30,
    zIndex: 0
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05
  },

  empty: {
    alignSelf: "center",
    color: "#999",
    fontSize: 24
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },

  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderColor: "#fff",
    marginVertical: 30,
    borderWidth: 5
  },
  matchName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff"
  },
  matchBio: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.8)",
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 30
  },
  closeMatch: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 30,
    fontWeight: "bold"
  }
});
