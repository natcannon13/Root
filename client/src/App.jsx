import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { useEffect } from "react";
import socket from "./websocket/socket";

import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CreateGamePage from "./pages/CreateGamePage";
import JoinPage from './pages/JoinPage';
import LobbyPage from './pages/LobbyPage';
//import GamePage from "./pages/GamePage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/create" element={<CreateGamePage />} />

        <Route path="/join" element = {<JoinPage/>}/>

        <Route path="/lobby" element = {<LobbyPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
