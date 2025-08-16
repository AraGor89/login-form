import { useState, type SyntheticEvent } from "react";
import { Tabs, Tab, Box } from "@mui/material";

import Cars from "./games/Cars";
import Game2048 from "./games/Game2048";
import SnakeGame from "./games/SnakeGame";
import WhackAMole from "./games/WhackAMole";
import FlappyBird from "./games/FlappyBird";
import LoginForm from "./Form/LoginForm";

import "./App.css";
import PingPong from "./games/PingPong";

export default function App() {
  const [mainTab, setMainTab] = useState(0);
  const [gameTab, setGameTab] = useState(0);

  const handleMainChange = (e: SyntheticEvent, newVal: number) =>
    setMainTab(newVal);
  const handleGameChange = (e: SyntheticEvent, newVal: number) =>
    setGameTab(newVal);

  return (
    <Box sx={{ width: "100%", maxWidth: 900, margin: "0 auto", padding: 2 }}>
      {/* Main Tabs */}
      <Tabs
        value={mainTab}
        onChange={handleMainChange}
        centered
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Form" />
        <Tab label="Games" />
      </Tabs>

      {/* Form Tab */}
      {mainTab === 0 && <LoginForm />}

      {/* Games Tab with Subtabs */}
      {mainTab === 1 && (
        <Box>
          <Tabs
            value={gameTab}
            onChange={handleGameChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ marginBottom: 2 }}
          >
            <Tab label="Snake" />
            <Tab label="Whack-a-Mole" />
            <Tab label="Flappy Bird" />
            <Tab label="2048" />
            <Tab label="Cars" />
            <Tab label="Ping pong" />
          </Tabs>

          <Box sx={{ marginTop: 2 }}>
            {gameTab === 0 && <SnakeGame />}
            {gameTab === 1 && <WhackAMole />}
            {gameTab === 2 && <FlappyBird />}
            {gameTab === 3 && <Game2048 />}
            {gameTab === 4 && <Cars />}
            {gameTab === 5 && <PingPong />}
          </Box>
        </Box>
      )}
    </Box>
  );
}
