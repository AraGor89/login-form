import React, { useState, useEffect, useRef } from "react";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const BALL_SIZE = 20;
const PADDLE_SPEED = 20;
const SPEED_INCREMENT = 0.2; // increase speed per hit

const PingPong: React.FC = () => {
  const [paddleX, setPaddleX] = useState(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [ball, setBall] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [ballVelocity, setBallVelocity] = useState({ dx: 3, dy: 3 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoop = useRef<ReturnType<typeof setInterval> | null>(null);

  const movePaddle = (dir: "left" | "right") => {
    setPaddleX((x) =>
      Math.max(
        0,
        Math.min(
          GAME_WIDTH - PADDLE_WIDTH,
          dir === "left" ? x - PADDLE_SPEED : x + PADDLE_SPEED
        )
      )
    );
  };

  const tick = () => {
    const newBall = { ...ball };
    newBall.x += ballVelocity.dx;
    newBall.y += ballVelocity.dy;

    // Bounce off walls
    if (newBall.x <= 0 || newBall.x + BALL_SIZE >= GAME_WIDTH)
      setBallVelocity((v) => ({ ...v, dx: -v.dx }));
    if (newBall.y <= 0) setBallVelocity((v) => ({ ...v, dy: -v.dy }));

    // Bounce off paddle
    if (
      newBall.y + BALL_SIZE >= GAME_HEIGHT - PADDLE_HEIGHT &&
      newBall.x + BALL_SIZE >= paddleX &&
      newBall.x <= paddleX + PADDLE_WIDTH
    ) {
      // Reflect
      setBallVelocity((v) => ({
        dx: v.dx + (v.dx > 0 ? SPEED_INCREMENT : -SPEED_INCREMENT),
        dy: -(v.dy + SPEED_INCREMENT),
      }));
      setScore((s) => s + 1);
    }

    // Game over
    if (newBall.y + BALL_SIZE > GAME_HEIGHT) {
      setGameOver(true);
      if (gameLoop.current) clearInterval(gameLoop.current);
    }

    setBall(newBall);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!gameOver) {
        if (e.key === "ArrowLeft") movePaddle("left");
        if (e.key === "ArrowRight") movePaddle("right");
      }
    };

    document.addEventListener("keydown", handleKey);
    gameLoop.current = setInterval(tick, 20);

    return () => {
      document.removeEventListener("keydown", handleKey);
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, [ball, ballVelocity, paddleX, gameOver]);

  const restartGame = () => {
    setBall({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    setBallVelocity({ dx: 3, dy: 3 });
    setPaddleX(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
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
        backgroundColor: "#1abc9c",
        margin: "20px auto",
        position: "relative",
        border: "4px solid #16a085",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Paddle */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: paddleX,
          width: PADDLE_WIDTH,
          height: PADDLE_HEIGHT,
          backgroundColor: "#2c3e50",
          borderRadius: "4px",
        }}
      />

      {/* Ball */}
      <div
        style={{
          position: "absolute",
          left: ball.x,
          top: ball.y,
          width: BALL_SIZE,
          height: BALL_SIZE,
          backgroundColor: "#e74c3c",
          borderRadius: "50%",
        }}
      />

      {/* Score */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          fontSize: "20px",
          fontWeight: "bold",
          color: "#fff",
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
            color: "#c0392b",
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

export default PingPong;
