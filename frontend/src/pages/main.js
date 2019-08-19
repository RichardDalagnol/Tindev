import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import like from "../assets/like.svg";
import dislike from "../assets/dislike.svg";
import api from "../services/api";
import "./main.css";
import io from "socket.io-client";
import itsamatch from "../assets/itsamatch.png";
import { Link } from "react-router-dom";

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState();

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/devs", {
        headers: {
          user: match.params.id
        }
      });
      setUsers(response.data);
    }

    loadUsers();
  }, [match.params.id]);

  useEffect(() => {
    const socket = io("http://localhost:3333", {
      query: { user: match.params.id }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
    });
  }, [match.params.id]);

  async function Like(id) {
    await api.post(`/devs/${id}/like`, null, {
      headers: { user: match.params.id }
    });
    setUsers(users.filter(user => user._id !== id));
  }

  async function DisLike(id) {
    await api.post(`/devs/${id}/dislike`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }
  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Logo Tindev" />
      </Link>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="buttons">
                <button type="button" onClick={() => Like(user._id)}>
                  <img src={like} />
                </button>
                <button type="button" onClick={() => DisLike(user._id)}>
                  <img src={dislike} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="acabou">Acabou</div>
      )}
      {matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="match" />
          <img className="avatar" src={matchDev.avatar} alt="" />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>
          <button type="button" onClick={() => setMatchDev(null)}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
