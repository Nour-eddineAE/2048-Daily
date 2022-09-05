import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
// the two cells that appear on refresh
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

/**
 * asynchronus function to visualize css animations
 * @param {Event} event
 */
async function handleInput(event) {
  switch (event.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      //if no one of the cases above,then type for the next event.
      setupInput();
      break;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if (!canMoveDown() && !canMoveUp() && !canMoveRight() && !canMoveLeft()) {
    newTile.waitForTransition(true).then(() => {
      alert("You have lost");
    });
    return;
  }
  // wait for the next click event.
  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  // we need to reverse the order of the cells to match our function
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function slideTiles(cells) {
  return Promise.all(
    //flatMap works the same as foreachn, it just returns an array instead
    cells.flatMap((group) => {
      const promises = [];
      // i starts at 1 since the cells in the first row can never move up.
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          /*
          if the cell can't go above, it can't go even further, 
          so we just leave the loop .
        */
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }
        //moving our current tile if there was empty cells above it, i.e lastValidCell != null.
        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          } //cleaning our current cell
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((column) => [...column].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      //obviously we can't go up since it's the top
      if (index === 0) return false;
      //we can't move empty tiles
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}
