import React, { useState, useEffect } from "react";

const GRID_SIZE = 4;

const getEmptyGrid = () =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

const getRandomEmptyCell = (grid: number[][]) => {
  const emptyCells: [number, number][] = [];
  grid.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push([i, j]);
    })
  );
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const addRandomTile = (grid: number[][]) => {
  const [i, j] = getRandomEmptyCell(grid);
  grid[i][j] = Math.random() < 0.9 ? 2 : 4;
  return grid;
};

const cloneGrid = (grid: number[][]) => grid.map((row) => [...row]);

const compress = (row: number[]) => {
  const newRow = row.filter((x) => x !== 0);
  while (newRow.length < GRID_SIZE) newRow.push(0);
  return newRow;
};

const merge = (row: number[]) => {
  for (let i = 0; i < GRID_SIZE - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return row;
};

const rotateLeft = (grid: number[][]) => {
  const newGrid = getEmptyGrid();
  for (let i = 0; i < GRID_SIZE; i++)
    for (let j = 0; j < GRID_SIZE; j++)
      newGrid[i][j] = grid[j][GRID_SIZE - i - 1];
  return newGrid;
};

const moveLeft = (grid: number[][]) => {
  const newGrid = grid.map((row) => merge(compress(row)));
  return newGrid;
};

const moveRight = (grid: number[][]) =>
  moveLeft(grid.map((row) => row.reverse())).map((row) => row.reverse());

const moveUp = (grid: number[][]) =>
  rotateLeft(moveLeft(rotateLeft(rotateLeft(grid))));
const moveDown = (grid: number[][]) =>
  rotateLeft(rotateLeft(rotateLeft(moveLeft(rotateLeft(grid)))));

const isGameOver = (grid: number[][]) => {
  for (let i = 0; i < GRID_SIZE; i++)
    for (let j = 0; j < GRID_SIZE; j++) if (grid[i][j] === 0) return false;
  // check horizontal/vertical merges
  for (let i = 0; i < GRID_SIZE; i++)
    for (let j = 0; j < GRID_SIZE - 1; j++)
      if (grid[i][j] === grid[i][j + 1]) return false;
  for (let j = 0; j < GRID_SIZE; j++)
    for (let i = 0; i < GRID_SIZE - 1; i++)
      if (grid[i][j] === grid[i + 1][j]) return false;
  return true;
};

const Game2048: React.FC = () => {
  const [grid, setGrid] = useState(
    addRandomTile(addRandomTile(getEmptyGrid()))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleKey = (e: KeyboardEvent) => {
    if (gameOver) return;
    let newGrid = cloneGrid(grid);
    switch (e.key) {
      case "ArrowLeft":
        newGrid = moveLeft(newGrid);
        break;
      case "ArrowRight":
        newGrid = moveRight(newGrid);
        break;
      case "ArrowUp":
        newGrid = moveUp(newGrid);
        break;
      case "ArrowDown":
        newGrid = moveDown(newGrid);
        break;
      default:
        return;
    }
    if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
      newGrid = addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(newGrid.flat().reduce((a, b) => a + b, 0));
      if (isGameOver(newGrid)) setGameOver(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, gameOver]);

  const restartGame = () => {
    setGrid(addRandomTile(addRandomTile(getEmptyGrid())));
    setScore(0);
    setGameOver(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        marginTop: "20px",
      }}
    >
      <h1 style={{ color: "#2c3e50" }}>2048 Game</h1>
      <p style={{ fontSize: "18px" }}>Score: {score}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 80px)`,
          gap: "10px",
          justifyContent: "center",
          margin: "20px auto",
        }}
      >
        {grid.flat().map((cell, idx) => (
          <div
            key={idx}
            style={{
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: cell === 0 ? "#bdc3c7" : "#f39c12",
              color: "#fff",
              fontSize: "24px",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            {cell !== 0 ? cell : ""}
          </div>
        ))}
      </div>
      {gameOver && (
        <div
          style={{ fontSize: "20px", color: "#e74c3c", marginBottom: "10px" }}
        >
          💀 Game Over!
        </div>
      )}
      <button
        onClick={restartGame}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#3498db",
          border: "none",
          borderRadius: "6px",
          color: "white",
          cursor: "pointer",
        }}
      >
        Restart Game
      </button>
    </div>
  );
};

export default Game2048;
