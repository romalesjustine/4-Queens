const N = 4; // Board size (N x N)
let currentState = [];
let solving = false;

const boardEl = document.getElementById("board");
const statusText = document.getElementById("status");

// Display the board with queens based on current state
function generateBoard(state) {
  boardEl.innerHTML = "";
  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (state[row] === col) {
        const queen = document.createElement("div");
        queen.className = "queen";
        queen.textContent = "♛";
        cell.appendChild(queen);
      }
      boardEl.appendChild(cell);
    }
  }
}

// Generate a random initial state (one queen per row)
function randomState() {
  return Array.from({ length: N }, () => Math.floor(Math.random() * N));
}

// Count the number of attacking queen pairs
function heuristic(state) {
  let h = 0;
  for (let i = 0; i < N - 1; i++) {
    for (let j = i + 1; j < N; j++) {
      // Queens attack if in same column or same diagonal
      if (
        state[i] === state[j] ||
        Math.abs(state[i] - state[j]) === Math.abs(i - j)
      ) {
        h++;
      }
    }
  }
  return h;
}

// Generate the next best state with the lowest heuristic
function getNextState(state) {
  let minH = heuristic(state);
  let next = [...state];

  for (let row = 0; row < N; row++) {
    const originalCol = state[row];
    for (let col = 0; col < N; col++) {
      if (col === originalCol) continue;
      const newState = [...state];
      newState[row] = col;
      const newH = heuristic(newState);
      if (newH < minH) {
        minH = newH;
        next = newState;
      }
    }
  }

  return next;
}

// Start the Hill Climbing algorithm
function startHillClimb() {
  if (solving) return;

  solving = true;
  statusText.textContent = "";
  let steps = 0;

  const interval = setInterval(() => {
    const h = heuristic(currentState);

    // Stop if goal state is reached
    if (h === 0) {
      clearInterval(interval);
      statusText.textContent = `✅ Success! Solved in ${steps} steps.`;
      solving = false;
      return;
    }

    const next = getNextState(currentState);

    // Stop if stuck in a local minimum
    if (heuristic(next) >= h) {
      clearInterval(interval);
      statusText.textContent = `⚠️ Stuck in local optimum after ${steps} steps. Try resetting!`;
      solving = false;
      return;
    }

    currentState = next;
    generateBoard(currentState);
    steps++;
  }, 500);
}

// Generate a new random board state
function resetBoard() {
  currentState = randomState();
  generateBoard(currentState);
  statusText.textContent = "🔄 New board generated.";
  solving = false;
}

// Show a board when the page loads
window.onload = resetBoard;
