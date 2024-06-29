import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { flash } from "react-animations";

// Initialize the Tic-Tac-Toe board and bombs
const initializeBoard = () => [
  [-2, -2, 0, -2, -2],
  [-2, 0, 0, 0, -2],
  [-2, 0, 0, 0, -2],
  [-2, 0, 0, 0, 0],
  [0, -2, -2, -2, -2],
];
const initializeBombs = () => [
  [-2, -2, 0, -2, -2],
  [-2, 0, 0, 0, -2],
  [-2, 0, 0, 0, -2],
  [-2, 0, 0, 0, 0],
  [0, -2, -2, -2, -2],
];
const initialPlayerBombs = { row: 1, col: 1 };
const initialAiBombs = { row: 1, col: 1 };

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const BombControlsContainer = styled.div`
  margin-top: 20px;
`;

const BombIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin: 0 10px;
  font-size: 24px;
  &:hover {
    color: red;
  }

  &.disabled {
    pointer-events: none;
    color: #d0d0d0;
  }
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 50px);
  gap: 5px;
`;

const CellButton = styled.button`
  width: 50px;
  height: 50px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ value }) =>
    value === 1 ? "blue" : value === -1 ? "red" : "black"};
  background-color: #f0f0f0; /* Default background color */
  border: 1px solid #ccc;
  transition: background-color 0.3s ease;
  visibility: ${({ value }) => (value === -2 ? "hidden" : "visible")};
  &:hover {
    background-color: #e0e0e0; /* Lighter background on hover */
  }

  &:disabled {
    background-color: #d0d0d0; /* Disabled background color */
    cursor: not-allowed;
  }
`;

const bombAnimation = keyframes`${flash}`;

const BombAnimationDiv = styled.div`
  animation: 1s ${bombAnimation};
`;

const NewGameButton = styled.button`
  font-size: 16px;
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #4caf50; /* Green background */
  border: none;
  color: white; /* White text */
  text-align: center;
  text-decoration: none;
  display: inline-block;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background-color: #45a049; /* Darker green on hover */
  }
`;

const App = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [bombs, setBombs] = useState(initializeBombs());
  const [playerBombs, setPlayerBombs] = useState(initialPlayerBombs);
  const [aiBombs, setAiBombs] = useState(initialAiBombs);
  const [turn, setTurn] = useState("Player");
  const [message, setMessage] = useState("");
  const [selectedRow, setSelectedRow] = useState(0); // Default selected row
  const [selectedCol, setSelectedCol] = useState(0); // Default selected column
  const [winner, setWinner] = useState(null); // New state for winner

  useEffect(() => {
    newGame();
  }, []);

  const newGame = () => {
    console.log("reset");
    setBoard(initializeBoard());
    setBombs(initializeBombs());
    setPlayerBombs(initialPlayerBombs);
    setAiBombs(initialAiBombs);
    setTurn("Player");
    setMessage("Player's Turn");
    setWinner(null); // Reset winner state
  };

  const updateBoard = (board, bombs, playerBombs, aiBombs) => {
    setBoard([...board]);
    setBombs([...bombs]);
    setPlayerBombs({ ...playerBombs });
    setAiBombs({ ...aiBombs });
  };

  const handleCellClick = (row, col) => {
    if (turn === "Player" && board[row][col] === 0 && bombs[row][col] === 0) {
      setMove(board, row, col, 1);
      updateBoard(board, bombs, playerBombs, aiBombs);
      if (!gameWon(board) && !boardFull(board)) {
        setTurn("AI");
        setMessage("AI's Turn");
        setTimeout(() => handleAIMove(), 500);
      } else {
        checkGameResult(board);
      }
    }
  };

  const handleAIMove = () => {
    const newBoard = [...board];
    oComp(newBoard, bombs, aiBombs, playerBombs);
    setBoard(newBoard);
    if (!gameWon(newBoard) && !boardFull(newBoard)) {
      setTurn("Player");
      setMessage("Player's Turn");
    } else {
      checkGameResult(newBoard);
    }
  };

  const placeBomb = (type) => {
    if (type === "row" && playerBombs.row > 0) {
      detonateBomb(board, bombs, selectedRow, "row");
      setPlayerBombs({ ...playerBombs, row: playerBombs.row - 1 });
      if (playerBombs.row - 1 === 0) {
        document.getElementById("rowBombButton").classList.add("disabled");
      }
    } else if (type === "col" && playerBombs.col > 0) {
      detonateBomb(board, bombs, selectedCol, "col");
      setPlayerBombs({ ...playerBombs, col: playerBombs.col - 1 });
      if (playerBombs.col - 1 === 0) {
        document.getElementById("colBombButton").classList.add("disabled");
      }
    }
    setTurn("AI");
    setMessage("AI's Turn");
    setTimeout(() => handleAIMove(), 500);
  };

  const gameWon = (board) => {
    return winningPlayer(board, 1) || winningPlayer(board, -1);
  };

  const boardFull = (board) => {
    return board.flat().every((cell) => cell !== 0);
  };

  const checkGameResult = (board) => {
    if (winningPlayer(board, 1)) {
      setMessage("Player has won!");
      setWinner("Player"); // Set winner state
      disableBoard();
    } else if (winningPlayer(board, -1)) {
      setMessage("AI has won!");
      setWinner("AI"); // Set winner state
      disableBoard();
    } else if (boardFull(board)) {
      setMessage("The game is a draw.");
      setWinner("Draw"); // Set winner state
      disableBoard();
    }
  };

  const disableBoard = () => {
    const cells = document.querySelectorAll('button:not([value="new game"])'); // Exclude New Game button
    console.log(cells);
    cells.forEach((cell) => {
      cell.disabled = true;
    });
    document.getElementById("rowBombButton").classList.add("disabled");
    document.getElementById("colBombButton").classList.add("disabled");
  };

  const winningPlayer = (board, player) => {
    const conditions = [
      [board[0][2], board[1][2], board[2][2]], //top cell rule
      [board[3][2], board[3][3], board[3][4]], //right cell rule
      [board[1][2], board[2][3], board[3][4]], //right cell rule
      [board[4][0], board[3][1], board[2][2]], //bottom left cell rule
      [board[1][1], board[1][2], board[1][3]],
      [board[2][1], board[2][2], board[2][3]],
      [board[3][1], board[3][2], board[3][3]],
      [board[1][1], board[2][1], board[3][1]],
      [board[1][2], board[2][2], board[3][2]],
      [board[1][3], board[2][3], board[3][3]],
      [board[1][1], board[2][2], board[3][3]],
      [board[1][3], board[2][2], board[3][1]],
    ];
    return conditions.some((condition) =>
      condition.every((cell) => cell === player)
    );
  };

  const setMove = (board, x, y, player) => {
    const newBoard = [...board];
    newBoard[x][y] = player;
    setBoard(newBoard);
  };

  const detonateBomb = (board, bombs, index, bomb_type) => {
    const newBoard = [...board];
    const newBombs = [...bombs];
    if (bomb_type === "row") {
      for (let i = 0; i < 5; i++) {
        if (newBoard[index][i] === -2) {
          newBoard[index][i] = -2;
          newBombs[index][i] = -2;
        } else {
          newBoard[index][i] = 0;
          newBombs[index][i] = 0;
        }
        addBombAnimation(index, i); // Add animation
      }
    } else if (bomb_type === "col") {
      for (let i = 0; i < 5; i++) {
        if (newBoard[index][i] === -2) {
          newBoard[index][i] = -2;
          newBombs[index][i] = -2;
        } else {
          newBoard[index][i] = 0;
          newBombs[index][i] = 0;
        }
        addBombAnimation(i, index); // Add animation
      }
    }
    setBoard(newBoard);
    setBombs(newBombs);
  };

  // Add animation to cell
  const addBombAnimation = (row, col) => {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
      cell.classList.add("bomb-animation");
      setTimeout(() => {
        cell.classList.remove("bomb-animation");
      }, 1000); // Duration of animation
    }
  };

  const evaluate = (board) => {
    if (winningPlayer(board, 1)) {
      return 1;
    } else if (winningPlayer(board, -1)) {
      return -1;
    } else {
      return 0;
    }
  };

  const heuristic = (board) => {
    return evaluate(board);
  };

  const abminimax = (
    board,
    bombs,
    depth,
    alpha,
    beta,
    player,
    playerBombs,
    aiBombs
  ) => {
    let row = -1;
    let col = -1;
    let bombMove = null;
    if (depth === 0 || gameWon(board)) {
      return [row, col, heuristic(board), bombMove];
    }

    let bestScore = player === 1 ? -Infinity : Infinity;
    const moves = blanks(board);

    for (let cell of moves) {
      setMove(board, cell[0], cell[1], player);
      let score = abminimax(
        board,
        bombs,
        depth - 1,
        alpha,
        beta,
        -player,
        playerBombs,
        aiBombs
      )[2];
      setMove(board, cell[0], cell[1], 0);
      if (player === 1) {
        if (score > bestScore) {
          bestScore = score;
          row = cell[0];
          col = cell[1];
        }
        alpha = Math.max(alpha, score);
      } else {
        if (score < bestScore) {
          bestScore = score;
          row = cell[0];
          col = cell[1];
        }
        beta = Math.min(beta, score);
      }
      if (beta <= alpha) {
        break;
      }
    }
    // [-2, -2, 0, -2, -2],
    // [-2, 1, 0, 0, -2],
    // [-2, 0, 0, 0, -2],
    // [-2, 0, 0, 0, 0],
    // [0, -2, -2, -2, -2],

    // Consider using bombs
    if (player === 1 && playerBombs.row > 0) {
      for (let i = 0; i < 5; i++) {
        if (bombs[i].some((bomb, j) => bomb === 0 && board[i][j] !== 0)) {
          const tempRow = [...board[i]];
          detonateBomb(board, bombs, i, "row");
          let score = abminimax(
            board,
            bombs,
            depth - 1,
            alpha,
            beta,
            -player,
            playerBombs,
            aiBombs
          );
          board[i] = tempRow;
          if (score[2] > bestScore) {
            bestScore = score[2];
            bombMove = ["row", i];
            alpha = Math.max(alpha, bestScore);
            if (alpha >= beta) break;
          }
        }
      }
    }

    if (player === 1 && playerBombs.col > 0) {
      for (let j = 0; j < 3; j++) {
        if (bombs.some((row, i) => row[j] === 0 && board[i][j] !== 0)) {
          const tempCol = board.map((row) => row[j]);
          detonateBomb(board, bombs, j, "col");
          let score = abminimax(
            board,
            bombs,
            depth - 1,
            alpha,
            beta,
            -player,
            playerBombs,
            aiBombs
          );
          for (let i = 0; i < 3; i++) board[i][j] = tempCol[i];
          if (score[2] > bestScore) {
            bestScore = score[2];
            bombMove = ["col", j];
            alpha = Math.max(alpha, bestScore);
            if (alpha >= beta) break;
          }
        }
      }
    }

    if (player === -1 && aiBombs.row > 0) {
      for (let i = 0; i < 3; i++) {
        if (bombs[i].some((bomb, j) => bomb === 0 && board[i][j] !== 0)) {
          const tempRow = [...board[i]];
          detonateBomb(board, bombs, i, "row");
          let score = abminimax(
            board,
            bombs,
            depth - 1,
            alpha,
            beta,
            -player,
            playerBombs,
            aiBombs
          );
          board[i] = tempRow;
          if (score[2] < bestScore) {
            bestScore = score[2];
            bombMove = ["row", i];
            beta = Math.min(beta, bestScore);
            if (alpha >= beta) break;
          }
        }
      }
    }

    if (player === -1 && aiBombs.col > 0) {
      for (let j = 0; j < 3; j++) {
        if (bombs.some((row, i) => row[j] === 0 && board[i][j] !== 0)) {
          const tempCol = board.map((row) => row[j]);
          detonateBomb(board, bombs, j, "col");
          let score = abminimax(
            board,
            bombs,
            depth - 1,
            alpha,
            beta,
            -player,
            playerBombs,
            aiBombs
          );
          for (let i = 0; i < 3; i++) board[i][j] = tempCol[i];
          if (score[2] < bestScore) {
            bestScore = score[2];
            bombMove = ["col", j];
            beta = Math.min(beta, bestScore);
            if (alpha >= beta) break;
          }
        }
      }
    }

    return [row, col, bestScore, bombMove];
  };

  const oComp = (board, bombs, aiBombs, playerBombs) => {
    const availableMoves = blanks(board);
    if (availableMoves.length >= 11) {
      const [x, y] =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      setMove(board, x, y, -1);
    } else {
      const result = abminimax(
        board,
        bombs,
        availableMoves.length,
        -Infinity,
        Infinity,
        -1,
        playerBombs,
        aiBombs
      );
      if (result[3]) {
        const [bombType, index] = result[3];
        detonateBomb(board, bombs, index, bombType);
        aiBombs[bombType] -= 1;
      } else {
      setMove(board, result[0], result[1], -1);
      }
    }
    setBoard([...board]);
    setBombs([...bombs]);
  };

  const blanks = (board) => {
    const moves = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === 0) {
          moves.push([i, j]);
        }
      }
    }
    return moves;
  };

  return (
    <AppContainer>
      <h1 style={{ color: "green" }}>Tic-Tac-Toe with Bombs</h1>
      <div style={{ color: "green" }}>{message}</div>
      <div style={{ color: "blue" }}>
        Player Bombs: Row - {playerBombs.row}, Column - {playerBombs.col}
      </div>
      <div style={{ color: "red" }}>
        AI Bombs: Row - {aiBombs.row}, Column - {aiBombs.col}
      </div>
      <BoardContainer>
        <GameBoard>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <CellButton
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                value={cell}
                id={`cell-${rowIndex}-${colIndex}`}
                className={
                  cell === -2
                    ? "hidden"
                    : bombs[rowIndex][colIndex] === 1
                    ? "bomb"
                    : ""
                }
                disabled={winner !== null}
              >
                {cell === 1 && "X"}
                {cell === -1 && "O"}
                {bombs[rowIndex][colIndex] === 1 && (
                  <BombAnimationDiv>
                    <BombIcon icon={faBomb} />
                  </BombAnimationDiv>
                )}
              </CellButton>
            ))
          )}
        </GameBoard>
        <BombControlsContainer>
          <div>
            <select
              id="rowBombSelect"
              value={selectedRow}
              onChange={(e) => setSelectedRow(parseInt(e.target.value))}
              disabled={winner !== null}
            >
              <option value={0}>Row 1</option>
              <option value={1}>Row 2</option>
              <option value={2}>Row 3</option>
            </select>
            <BombIcon
              id="rowBombButton"
              icon={faBomb}
              onClick={() => placeBomb("row")}
            />
          </div>
          <div>
            <select
              id="colBombSelect"
              value={selectedCol}
              onChange={(e) => setSelectedCol(parseInt(e.target.value))}
              disabled={winner !== null}
            >
              <option value={0}>Column 1</option>
              <option value={1}>Column 2</option>
              <option value={2}>Column 3</option>
            </select>
            <BombIcon
              id="colBombButton"
              icon={faBomb}
              onClick={() => placeBomb("col")}
            />
          </div>
        </BombControlsContainer>
        <NewGameButton value="new game" onClick={() => newGame()}>
          New Game
        </NewGameButton>
      </BoardContainer>
    </AppContainer>
  );
};

export default App;
