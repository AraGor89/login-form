import React, { useState, useEffect, useRef } from "react";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 2;
const JUMP_STRENGTH = -35;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;

interface Pipe {
  top: number;
  left: number;
}

const FlappyBird: React.FC = () => {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoop = useRef<ReturnType<typeof setInterval> | null>(null);

  // Jump (click or spacebar)
  const jump = () => {
    if (!gameOver) {
      setVelocity(JUMP_STRENGTH);
    }
  };

  // Pipe generator
  const createPipe = () => {
    const topHeight =
      Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP - 100)) + 50;
    return { top: topHeight, left: GAME_WIDTH };
  };

  // Game loop
  const tick = () => {
    setBirdY((y) => y + velocity / 5);
    setVelocity((v) => v + GRAVITY / 2);

    setPipes((prev) =>
      prev
        .map((pipe) => ({ ...pipe, left: pipe.left - PIPE_SPEED }))
        .filter((pipe) => pipe.left + PIPE_WIDTH > 0)
    );

    // Add new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].left < GAME_WIDTH - 200) {
      setPipes((prev) => [...prev, createPipe()]);
    }

    // Collision detection
    if (birdY < 0 || birdY > GAME_HEIGHT - 30) {
      setGameOver(true);
      return;
    }

    pipes.forEach((pipe) => {
      if (
        pipe.left < 80 &&
        pipe.left + PIPE_WIDTH > 30 &&
        (birdY < pipe.top || birdY > pipe.top + PIPE_GAP)
      ) {
        setGameOver(true);
      }

      // score counting
      if (pipe.left + PIPE_WIDTH === 30) {
        setScore((s) => s + 1);
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") jump();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", jump);

    gameLoop.current = setInterval(tick, 20);

    return () => {
      if (gameLoop.current) clearInterval(gameLoop.current);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", jump);
    };
  }, [gameOver, pipes, birdY, velocity]);

  const restartGame = () => {
    if (gameLoop.current) clearInterval(gameLoop.current);
    setBirdY(GAME_HEIGHT / 2);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    gameLoop.current = setInterval(tick, 20);
  };

  return (
    <div
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: "#87CEEB",
        border: "4px solid #2c3e50",
        margin: "20px auto",
        position: "relative",
        overflow: "hidden",
        borderRadius: "8px",
      }}
    >
      {/* Bird */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: birdY,
          width: 30,
          height: 30,
          backgroundColor: "#f1c40f",
          borderRadius: "50%",
        }}
      />

      {/* Pipes */}
      {pipes.map((pipe, idx) => (
        <React.Fragment key={idx}>
          <div
            style={{
              position: "absolute",
              left: pipe.left,
              top: 0,
              width: PIPE_WIDTH,
              height: pipe.top,
              backgroundColor: "#2ecc71",
              border: "2px solid #27ae60",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: pipe.left,
              top: pipe.top + PIPE_GAP,
              width: PIPE_WIDTH,
              height: GAME_HEIGHT - (pipe.top + PIPE_GAP),
              backgroundColor: "#2ecc71",
              border: "2px solid #27ae60",
            }}
          />
        </React.Fragment>
      ))}

      {/* Score */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#2c3e50",
        }}
      >
        {score}
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
            fontWeight: "bold",
            color: "#e74c3c",
            textAlign: "center",
          }}
        >
          💀 Game Over! <br />
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

export default FlappyBird;
