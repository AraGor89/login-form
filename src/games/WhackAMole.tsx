import React, { useState, useEffect, useRef } from "react";

const GRID_SIZE = 3; // 3x3 board
const GAME_TIME = 30; // seconds

const WhackAMole: React.FC = () => {
  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameOver, setGameOver] = useState(false);

  const moleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // start game
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setGameOver(false);
    setMoleIndex(null);

    if (moleTimer.current) clearInterval(moleTimer.current);
    if (gameTimer.current) clearInterval(gameTimer.current);

    // moles appear randomly
    moleTimer.current = setInterval(() => {
      setMoleIndex(Math.floor(Math.random() * GRID_SIZE * GRID_SIZE));
    }, 800);

    // countdown timer
    gameTimer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(gameTimer.current!);
          clearInterval(moleTimer.current!);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startGame();
    return () => {
      if (moleTimer.current) clearInterval(moleTimer.current);
      if (gameTimer.current) clearInterval(gameTimer.current);
    };
  }, []);

  // handle click
  const whack = (index: number) => {
    if (index === moleIndex && !gameOver) {
      setScore((s) => s + 1);
      setMoleIndex(null); // remove mole when hit
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#2c3e50" }}>🐹 Whack-a-Mole</h1>
      <p style={{ fontSize: "18px" }}>Score: {score}</p>
      <p style={{ fontSize: "18px" }}>Time Left: {timeLeft}s</p>

      {/* Game Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 120px)`,
          gap: "15px",
          justifyContent: "center",
          margin: "20px auto",
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <button
            key={i}
            onClick={() => whack(i)}
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#95a5a6",
              borderRadius: "10px",
              border: "3px solid #2c3e50",
              cursor: "pointer",
              fontSize: "40px",
              transition: "background 0.2s",
            }}
          >
            {i === moleIndex ? "🐹" : ""}
          </button>
        ))}
      </div>

      {gameOver && (
        <div style={{ fontSize: "20px", color: "#e74c3c", margin: "10px" }}>
          ⏳ Game Over! Final Score: {score}
        </div>
      )}

      <button
        onClick={startGame}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {gameOver ? "Restart" : "Restart Game"}
      </button>
    </div>
  );
};

export default WhackAMole;
