import React, { useState, useEffect, useRef } from "react";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const CAR_WIDTH = 50;
const CAR_HEIGHT = 100;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 100;
const SPEED = 5;

interface Obstacle {
  x: number;
  y: number;
}

const Cars: React.FC = () => {
  const [carX, setCarX] = useState(GAME_WIDTH / 2 - CAR_WIDTH / 2);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoop = useRef<ReturnType<typeof setInterval> | null>(null);

  const moveCar = (dir: "left" | "right") => {
    setCarX((x) => {
      const newX = dir === "left" ? x - 20 : x + 20;
      return Math.max(0, Math.min(GAME_WIDTH - CAR_WIDTH, newX));
    });
  };

  const tick = () => {
    setObstacles((prev) => {
      const newObstacles = prev
        .map((o) => ({ ...o, y: o.y + SPEED }))
        .filter((o) => o.y < GAME_HEIGHT);
      // collision
      for (const o of newObstacles) {
        if (
          o.y + OBSTACLE_HEIGHT > GAME_HEIGHT - CAR_HEIGHT &&
          o.y < GAME_HEIGHT &&
          o.x < carX + CAR_WIDTH &&
          o.x + OBSTACLE_WIDTH > carX
        ) {
          setGameOver(true);
          clearInterval(gameLoop.current!);
        }
      }
      return newObstacles;
    });

    // spawn new obstacle
    if (Math.random() < 0.02) {
      const x = Math.floor(Math.random() * (GAME_WIDTH - OBSTACLE_WIDTH));
      setObstacles((prev) => [...prev, { x, y: -OBSTACLE_HEIGHT }]);
    }

    if (!gameOver) setScore((s) => s + 1);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!gameOver) {
        if (e.key === "ArrowLeft") moveCar("left");
        if (e.key === "ArrowRight") moveCar("right");
      }
    };
    document.addEventListener("keydown", handleKey);
    gameLoop.current = setInterval(tick, 20);

    return () => {
      document.removeEventListener("keydown", handleKey);
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, [carX, gameOver]);

  const restartGame = () => {
    setCarX(GAME_WIDTH / 2 - CAR_WIDTH / 2);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    if (gameLoop.current) clearInterval(gameLoop.current);
    gameLoop.current = setInterval(tick, 20);
  };

  return (
    <div
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: "#34495e",
        margin: "20px auto",
        position: "relative",
        overflow: "hidden",
        borderRadius: "8px",
        border: "4px solid #2c3e50",
      }}
    >
      {/* Player Car */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: carX,
          width: CAR_WIDTH,
          height: CAR_HEIGHT,
          backgroundColor: "#e74c3c",
          borderRadius: "8px",
        }}
      />

      {/* Obstacles */}
      {obstacles.map((o, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            top: o.y,
            left: o.x,
            width: OBSTACLE_WIDTH,
            height: OBSTACLE_HEIGHT,
            backgroundColor: "#2ecc71",
            borderRadius: "8px",
          }}
        />
      ))}

      {/* Score */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          fontSize: "20px",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        Score: {score}
      </div>

      {/* Game Over */}
      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "28px",
            color: "#e74c3c",
            textAlign: "center",
          }}
        >
          💥 Game Over! <br />
          <button
            onClick={restartGame}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#3498db",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Cars;
