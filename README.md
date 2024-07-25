## Getting Started

This is a unique and fun twist on the classic Tic-Tac-Toe game, implemented in React with additional features like bombs and AI opponent. The game allows players to place bombs that can clear rows or columns, adding an extra layer of strategy to the gameplay.

### Features

- **Classic Tic-Tac-Toe Gameplay:** Play the traditional 3x3 game on a 5x5 grid with added complexity.
- **Bombs:** Each player (both human and AI) gets bombs (1 for row and 1 for col) that can clear entire rows or columns.
- **AI Opponent:** The AI uses the Minimax algorithm with alpha-beta pruning to make strategic moves.
- **Random Cell Initialization:** At the start of the game, three cells are randomly selected and blocked.
- **Responsive Design:** The game is designed to be responsive and interactive.

### Solution

The project is built using React, utilizing JavaScript, CSS, and HTML. The code includes components that enable the full functionality of the game, including move recognition, win detection, and the implementation of bombs and random squares.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/EladArmoni/Tic-Tac-Toe.git
   cd Tic-Tac-Toe
   ```
2. Install the dependencies:
   `npm install`
3. Start the application:
   `npm start`

### Game Rules

1. **Objective:** The goal is to align three of your marks (X for Player, O for AI) in a row, column, or diagonal.
2. **Turns:** Players take turns placing their marks on the board.
3. **Bombs:**

- Each player has 1 row bomb and 1 column bomb at the start.
- Use the dropdowns to select a row or column, then click the bomb icon to clear it.

4. **Winning:** The game ends when a player aligns three marks in a row, column, or diagonal, or when all cells are filled resulting in a draw.
