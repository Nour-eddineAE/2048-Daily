const GRID_SIZE = 3;
const CELL_SIZE = 15;
const CELL_GAP = 2;

export default class Grid {
  #cells;

  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

    this.#cells = createCellElement(gridElement).map((cellElement, index) => {
      /*
        - what i got from this is that each element in the return 
        of the function(cells array) already has indexes,
        - indexs are between 0 and (GRID_SIZE * GRID_SIZE - 1)
      */
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      );
    });
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  get cells() {
    return this.#cells;
  }

  get #allEmptyCells() {
    // return all the cells that have no tile
    return this.#cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell() {
    /*
     - takes a random index based on the length of "allEmptyCells" return ,
     then returns one of it's elements that has that index
    */
    const randomIndex = Math.floor(Math.random() * this.#allEmptyCells.length);
    return this.#allEmptyCells[randomIndex];
  }
}

class Cell {
  // making the variables private, preventing accessing it from outside  this class
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  //this changes the tile's position on the grid
  set tile(tile) {
    this.#tile = tile;
    if (tile == null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  // /**
  //  * returns true if the cell has no tile, or the tile content is equal to the current
  //  * cell's tile content "and" no tile to merge with, false otherwise
  //  * @param {*} tile
  //  * @returns
  //  */
  canAccept(tile) {
    return (
      this.tile == null ||
      (this.tile.tileContent === tile.tileContent && this.mergeTile == null)
    );
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.tileContent += this.mergeTile.tileContent;
    this.mergeTile.remove(); // removes the tile from the DOM
    this.mergeTile = null;
  }
}

function createCellElement(gridElement) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}
