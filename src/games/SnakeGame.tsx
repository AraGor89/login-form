import React, { useState, useEffect, useRef } from "react";

type Point = { x: number; y: number };

const CELL_SIZE = 20;
const WIDTH = 600;
const HEIGHT = 400;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Point>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameLoop = useRef<number | null>(null);

  // place food randomly
  const randomFood = (): Point => ({
    x: Math.floor(Math.random() * (WIDTH / CELL_SIZE)),
    y: Math.floor(Math.random() * (HEIGHT / CELL_SIZE)),
  });

  // movement logic
  const moveSnake = () => {
    setSnake((prevSnake) => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      // check collisions
      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= WIDTH / CELL_SIZE ||
        newHead.y >= HEIGHT / CELL_SIZE ||
        prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
      ) {
        setGameOver(true);
        if (gameLoop.current) clearInterval(gameLoop.current);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(randomFood());
      } else {
        newSnake.pop(); // move forward
      }

      return newSnake;
    });
  };

  // keyboard controls
  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver) return;
    switch (e.key) {
      case "ArrowUp":
      case "w":
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case "ArrowDown":
      case "s":
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case "ArrowLeft":
      case "a":
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case "ArrowRight":
      case "d":
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
    }
  };

  // start game loop
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    gameLoop.current = window.setInterval(moveSnake, 120);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, [direction]);

  const restartGame = () => {
    if (gameLoop.current) clearInterval(gameLoop.current);
    setSnake([{ x: 5, y: 5 }]);
    setFood(randomFood());
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    gameLoop.current = window.setInterval(moveSnake, 120);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        marginTop: "20px",
      }}
    >
      <h1 style={{ margin: "10px", color: "#2c3e50" }}>🐍 Snake Game</h1>
      <p style={{ fontSize: "18px", marginBottom: "10px" }}>Score: {score}</p>
      <div
        style={{
          position: "relative",
          width: WIDTH,
          height: HEIGHT,
          backgroundColor: "#ecf0f1",
          border: "4px solid #2c3e50",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {/* Snake */}
        {snake.map((segment, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: idx === 0 ? "#27ae60" : "#2ecc71",
              borderRadius: "4px",
            }}
          />
        ))}

        {/* Food */}
        <div
          style={{
            position: "absolute",
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: "#e74c3c",
            borderRadius: "50%",
          }}
        />
      </div>

      {gameOver && (
        <div style={{ marginTop: "20px", color: "#e74c3c", fontSize: "20px" }}>
          💀 Game Over! Final Score: {score}
        </div>
      )}

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
        {gameOver ? "Restart" : "Restart Game"}
      </button>
    </div>
  );
};

export default SnakeGame;
