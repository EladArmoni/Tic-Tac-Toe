import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { flash } from "react-animations";

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
  const initialPlayerBombs = { row: 1, col: 1 };
  const initialAiBombs = { row: 1, col: 1 };

  const [board, setBoard] = useState(null);
  const [bombs, setBombs] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [playerBombs, setPlayerBombs] = useState(initialPlayerBombs);
  const [aiBombs, setAiBombs] = useState(initialAiBombs);
  const [turn, setTurn] = useState("Player");
  const [message, setMessage] = useState("Player's Turn");
  const [selectedRow, setSelectedRow] = useState(0); // Default selected row
  const [selectedCol, setSelectedCol] = useState(0); // Default selected column
  const [winner, setWinner] = useState(null); // New state for winner

  useEffect(() => {
    newGame();
  }, []);

  async function createBoard() {
    const initialBoard = [
      [-2, -2, -2, -2, -2],
      [-2, 0, 0, 0, -2],
      [-2, 0, 0, 0, -2],
      [-2, 0, 0, 0, -2],
      [-2, -2, -2, -2, -2],
    ];
    const uniqueCells = new Set();
    while (uniqueCells.size < 3) {
      const row = Math.floor(Math.random() * 5);
      const col = Math.floor(Math.random() * 5);

      // Ensure the cell is currently -2 and not already chosen
      if (initialBoard[row][col] === -2) {
        initialBoard[row][col] = 0; // Change -2 to 0
        uniqueCells.add(`${row},${col}`);
      }
    }
    setBoard(initialBoard);
    setBombs(initialBoard);

    return initialBoard;
  }

  // Function to compute new conditions based on the updated board
  async function computeNewConditions(currBoard) {
    const size = currBoard.length;
    const newConditions = [];
    // Check rows for conditions
    for (let row = 0; row < size; row++) {
      for (let i = 0; i <= size - 3; i++) {
        // Check if the current cells and the next two cells are valid
        if (
          currBoard[row][i] === 0 && // Current cell
          currBoard[row][i + 1] === 0 && // Next cell
          currBoard[row][i + 2] === 0 // Next next cell
        ) {
          newConditions.push([
            [row, i],
            [row, i + 1],
            [row, i + 2],
          ]);
        }
      }
    }

    // Check columns for conditions
    for (let col = 0; col < size; col++) {
      for (let i = 0; i <= size - 3; i++) {
        // Check if the current cells and the next two cells are valid
        if (
          currBoard[i][col] === 0 && // Current cell
          currBoard[i + 1][col] === 0 && // Next cell
          currBoard[i + 2][col] === 0 // Next next cell
        ) {
          newConditions.push([
            [i, col],
            [i + 1, col],
            [i + 2, col],
          ]);
        }
      }
    }

    // Check diagonals for conditions
    for (let i = 0; i <= size - 3; i++) {
      for (let j = 0; j <= size - 3; j++) {
        // Check diagonal from top-left to bottom-right
        if (
          currBoard[i][j] === 0 && // Current cell
          currBoard[i + 1][j + 1] === 0 && // Next cell
          currBoard[i + 2][j + 2] === 0 // Next next cell
        ) {
          newConditions.push([
            [i, j],
            [i + 1, j + 1],
            [i + 2, j + 2],
          ]);
        }

        // Check diagonal from top-right to bottom-left
        if (
          currBoard[i][j + 2] === 0 && // Current cell
          currBoard[i + 1][j + 1] === 0 && // Next cell
          currBoard[i + 2][j] === 0 // Next next cell
        ) {
          newConditions.push([
            [i, j + 2],
            [i + 1, j + 1],
            [i + 2, j],
          ]);
        }
      }
    }
    setConditions(newConditions);
  }

  // Initialize the Tic-Tac-Toe board and bombs
  async function newGame() {
    const currBoard = await createBoard();
    await computeNewConditions(currBoard);
    setPlayerBombs(initialPlayerBombs);
    setAiBombs(initialAiBombs);
    setTurn("Player");
    setMessage("Player's Turn");
    setWinner(null); // Reset winner state
    setSelectedRow(0);
    setSelectedCol(0);
  }

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
      if (!gameWon(board) && !boardFull()) {
        setTurn("AI");
        setMessage("AI's Turn");
        setTimeout(() => handleAIMove(), 500);
      } else {
        checkGameResult();
      }
    }
  };
  const handleAIMove = () => {
    const newBoard = [...board];
    const result = abminimax(newBoard, 3, -Infinity, Infinity, -1);
    if (result[0] !== -1 && result[1] !== -1) {
      if (result[3]) {
        const [bombType, index] = result[3];
        detonateBomb(board, bombs, index, bombType);
        aiBombs[bombType] -= 1;
      } else {
        setMove(newBoard, result[0], result[1], -1);
      }
      if (!gameWon(newBoard) && !boardFull(newBoard)) {
        setTurn("Player");
        setMessage("Player's Turn");
      } else {
        checkGameResult(newBoard);
      }
    }
  };

  // const handleAIMove = () => {
  //   const newBoard = [...board];
  //   const newBombs = [...bombs];
  //   const newAiBombs = { ...aiBombs };
  //   const newPlayerBombs = { ...playerBombs };
  //   oComp(newBoard, newBombs, newAiBombs, newPlayerBombs);
  //   setBoard(newBoard);
  //   if (!gameWon(newBoard) && !boardFull(newBoard)) {
  //     setTurn("Player");
  //     setMessage("Player's Turn");
  //   } else {
  //     checkGameResult(newBoard);
  //   }
  // };

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

  const gameWon = (newBoard) => {
    return winningPlayer(newBoard, 1) || winningPlayer(newBoard, -1);
  };

  const boardFull = () => {
    return board.flat().every((cell) => cell !== 0);
  };

  const checkGameResult = () => {
    if (winningPlayer(board, 1)) {
      setMessage("Player has won!");
      setWinner("Player"); // Set winner state
      disableBoard();
    } else if (winningPlayer(board, -1)) {
      setMessage("AI has won!");
      setWinner("AI"); // Set winner state
      disableBoard();
    } else if (boardFull()) {
      setMessage("The game is a draw.");
      setWinner("Draw"); // Set winner state
      disableBoard();
    }
  };

  const disableBoard = () => {
    const cells = document.querySelectorAll('button:not([value="new game"])'); // Exclude New Game button
    cells.forEach((cell) => {
      cell.disabled = true;
    });
    document.getElementById("rowBombButton").classList.add("disabled");
    document.getElementById("colBombButton").classList.add("disabled");
  };

  const winningPlayer = (newBoard, player) => {
    return conditions.some((condition) =>
      condition.every(([x, y]) => newBoard[x][y] === player)
    );
  };

  const setMove = (newBoard, x, y, player) => {
    newBoard[x][y] = player;
    setBoard(newBoard);
  };

  const detonateBomb = (newBoard, newBombs, index, bomb_type) => {
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
        if (newBoard[i][index] === -2) {
          newBoard[i][index] = -2;
          newBombs[i][index] = -2;
        } else {
          newBoard[i][index] = 0;
          newBombs[i][index] = 0;
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

  const heuristic = (newBoard) => {
    if (winningPlayer(newBoard, 1)) {
      return 1;
    } else if (winningPlayer(newBoard, -1)) {
      return -1;
    } else {
      return 0;
    }
  };
  const abminimax = (newBoard, depth, alpha, beta, player) => {
    let row = -1;
    let col = -1;
    if (depth === 0 || gameWon(newBoard)) {
      return [row, col, heuristic(newBoard)];
    } else {
      for (let cell of blanks(newBoard)) {
        setMove(newBoard, cell[0], cell[1], player);
        let score = abminimax(newBoard, depth - 1, alpha, beta, -player)[2];
        newBoard[cell[0]][cell[1]] = 0;
        if (player === 1) {
          if (score > alpha) {
            alpha = score;
            row = cell[0];
            col = cell[1];
          }
        } else {
          if (score < beta) {
            beta = score;
            row = cell[0];
            col = cell[1];
          }
        }
        if (alpha >= beta) break;
      }
      return player === 1 ? [row, col, alpha] : [row, col, beta];
    }
  };

  // const abminimax = (
  //   newBoard,
  //   newBombs,
  //   depth,
  //   alpha,
  //   beta,
  //   player,
  //   newPlayerBombs,
  //   newAiBombs
  // ) => {
  //   let row = -1;
  //   let col = -1;
  //   let bombMove = null;
  //   if (depth === 0 || gameWon(newBoard)) {
  //     return [row, col, heuristic(newBoard), bombMove];
  //   } else {
  //     for (let cell of blanks(newBoard)) {
  //       setMove(newBoard, cell[0], cell[1], player);
  //       let score = abminimax(
  //         newBoard,
  //         newBombs,
  //         depth - 1,
  //         alpha,
  //         beta,
  //         -player,
  //         newPlayerBombs,
  //         newAiBombs
  //       )[2];
  //       newBoard[cell[0]][cell[1]] = 0;
  //       if (player === 1) {
  //         if (score > alpha) {
  //           alpha = score;
  //           row = cell[0];
  //           col = cell[1];
  //           bombMove = null;
  //         }
  //       } else {
  //         if (score < beta) {
  //           beta = score;
  //           row = cell[0];
  //           col = cell[1];
  //           bombMove = null;
  //         }
  //       }
  //       setMove(newBoard, cell[0], cell[1], 0);
  //       if (alpha >= beta) break;
  //     }

  //     // // Consider using bombs
  //     // if (player === 1 && newPlayerBombs.row > 0) {
  //     //   for (let i = 0; i < 5; i++) {
  //     //     if (newBombs[i].some((bomb, j) => bomb === 0 && newBoard[i][j] !== 0)) {
  //     //       const tempRow = [...newBoard[i]];
  //     //       detonateBomb(newBoard, newBombs, i, "row");
  //     //       let score = abminimax(
  //     //         newBoard,
  //     //         newBombs,
  //     //         depth - 1,
  //     //         alpha,
  //     //         beta,
  //     //         -player,
  //     //         { row: newPlayerBombs.row - 1, col: newPlayerBombs.col },
  //     //         newAiBombs
  //     //       );
  //     //       newBoard[i] = tempRow;
  //     //       if (score[2] > bestScore) {
  //     //         bestScore = score[2];
  //     //         bombMove = ["row", i];
  //     //         alpha = Math.max(alpha, bestScore);
  //     //         if (alpha >= beta) break;
  //     //       }
  //     //     }
  //     //   }
  //     // }

  //     // if (player === 1 && newPlayerBombs.col > 0) {
  //     //   for (let j = 0; j < 5; j++) {
  //     //     if (newBombs.some((row, i) => row[j] === 0 && newBoard[i][j] !== 0)) {
  //     //       const tempCol = newBoard.map((row) => row[j]);
  //     //       detonateBomb(newBoard, newBombs, j, "col");
  //     //       let score = abminimax(
  //     //         newBoard,
  //     //         newBombs,
  //     //         depth - 1,
  //     //         alpha,
  //     //         beta,
  //     //         -player,
  //     //         { row: newPlayerBombs.row, col: newPlayerBombs.col - 1 },
  //     //         newAiBombs
  //     //       );
  //     //       for (let i = 0; i < 5; i++) newBoard[i][j] = tempCol[i];
  //     //       if (score[2] > bestScore) {
  //     //         bestScore = score[2];
  //     //         bombMove = ["col", j];
  //     //         alpha = Math.max(alpha, bestScore);
  //     //         if (alpha >= beta) break;
  //     //       }
  //     //     }
  //     //   }
  //     // }

  //     // if (player === -1 && newAiBombs.row > 0) {
  //     //   for (let i = 0; i < 5; i++) {
  //     //     if (newBombs[i].some((bomb, j) => bomb === 0 && newBoard[i][j] !== 0)) {
  //     //       const tempRow = [...newBoard[i]];
  //     //       detonateBomb(newBoard, newBombs, i, "row");
  //     //       let score = abminimax(
  //     //         newBoard,
  //     //         newBombs,
  //     //         depth - 1,
  //     //         alpha,
  //     //         beta,
  //     //         -player,
  //     //         newPlayerBombs,
  //     //         { row: newAiBombs.row - 1, col: newAiBombs.col }
  //     //       );
  //     //       newBoard[i] = tempRow;
  //     //       if (score[2] < bestScore) {
  //     //         bestScore = score[2];
  //     //         bombMove = ["row", i];
  //     //         beta = Math.min(beta, bestScore);
  //     //         if (alpha >= beta) break;
  //     //       }
  //     //     }
  //     //   }
  //     // }

  //     // if (player === -1 && newAiBombs.col > 0) {
  //     //   for (let j = 0; j < 5; j++) {
  //     //     if (newBombs.some((row, i) => row[j] === 0 && newBoard[i][j] !== 0)) {
  //     //       const tempCol = newBoard.map((row) => row[j]);
  //     //       detonateBomb(newBoard, newBombs, j, "col");
  //     //       let score = abminimax(
  //     //         newBoard,
  //     //         newBombs,
  //     //         depth - 1,
  //     //         alpha,
  //     //         beta,
  //     //         -player,
  //     //         newPlayerBombs,
  //     //         { row: newAiBombs.row, col: newAiBombs.col - 1 }
  //     //       );
  //     //       for (let i = 0; i < 5; i++) newBoard[i][j] = tempCol[i];
  //     //       if (score[2] < bestScore) {
  //     //         bestScore = score[2];
  //     //         bombMove = ["col", j];
  //     //         beta = Math.min(beta, bestScore);
  //     //         if (alpha >= beta) break;
  //     //       }
  //     //     }
  //     //   }
  //     // }
  //     if (player === 1) {
  //       return [row, col, alpha, bombMove];
  //     } else {
  //       return [row, col, beta, bombMove];
  //     }
  //   }
  // };

  const oComp = (newBoard, newBombs, newAiBombs, newPlayerBombs) => {
    const availableMoves = blanks(newBoard);
    if (availableMoves.length >= 11) {
      const [x, y] =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      setMove(newBoard, x, y, -1);
    } else {
      const result = abminimax(
        newBoard,
        newBombs,
        availableMoves.length,
        -Infinity,
        Infinity,
        -1,
        newPlayerBombs,
        newAiBombs
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
  const blanks = (newBoard) => {
    const moves = [];
    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[0].length; j++) {
        if (newBoard[i][j] === 0) {
          moves.push([i, j]);
        }
      }
    }
    return moves;
  };

  // const blanks = (newBoard) => {
  //   const moves = [];
  //   for (let i = 0; i < newBoard.length; i++) {
  //     for (let j = 0; j < newBoard[0].length; j++) {
  //       if (newBoard[i][j] === 0) {
  //         moves.push([i, j]);
  //       }
  //     }
  //   }
  //   return moves;
  // };

  return (
    <AppContainer>
      <h1 style={{ color: "green" }}>Tic-Tac-Toe with Bombs</h1>
      <div style={{ color: "green" }}>{message}</div>
      <div style={{ color: "blue" }}>
        Player Bombs: Row - {playerBombs?.row}, Column - {playerBombs?.col}
      </div>
      <div style={{ color: "red" }}>
        AI Bombs: Row - {aiBombs?.row}, Column - {aiBombs?.col}
      </div>
      <BoardContainer>
        <GameBoard>
          {board !== null &&
            board.length === 5 &&
            board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <CellButton
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => {
                    handleCellClick(rowIndex, colIndex);
                  }}
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
                  {bombs[rowIndex][colIndex] === 1}
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
              <option value={3}>Row 4</option>
              <option value={4}>Row 5</option>
            </select>
            <BombIcon
              id="rowBombButton"
              icon={faBomb}
              onClick={() => placeBomb("row")}
              className={playerBombs.row === 0 ? "disabled" : ""}
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
              <option value={3}>Column 4</option>
              <option value={4}>Column 5</option>
            </select>
            <BombIcon
              id="colBombButton"
              icon={faBomb}
              onClick={() => placeBomb("col")}
              className={playerBombs.col === 0 ? "disabled" : ""}
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
