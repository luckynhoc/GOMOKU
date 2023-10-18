"use strict";

// let board = [
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
// ];
let board;
const boardSize = 16;
let boardElement = document.querySelector(".board");
let playerBlack = true;

const createBoard = function (_size) {
  let x = Array(_size).fill("");
  for (let i = 0; i < _size; i++) x[i] = Array(_size).fill("");
  return [...x];
};

board = createBoard(boardSize);

const getRange = function (id) {
  let x = Number(id.slice(0, 2));
  let y = Number(id.slice(2));
  console.log(x, y);
  let _minX = x - 4 > 0 ? x - 4 : 0;
  let _maxX = x + 4 < boardSize ? x + 4 : boardSize - 1;
  let _minY = y - 4 > 0 ? y - 4 : 0;
  let _maxY = y + 4 < boardSize ? y + 4 : boardSize - 1;

  return [
    [_minX, _maxX],
    [_minY, _maxY],
  ];
};

const highlight = function (id) {
  let range = getRange(id);
  for (let x = range[0][0]; x <= range[0][1]; x++) {
    for (let y = range[1][0]; y <= range[1][1]; y++) {
      let _id = createID(x, y);
      document.querySelector(`#i${_id}`).classList.add("yel");
    }
  }
};
const createID = function (x, y) {
  let _x = x <= 9 ? "0" + x : String(x);
  let _y = y <= 9 ? "0" + y : String(y);
  return `${_x}${_y}`;
};

for (let x = 0; x < boardSize; x++) {
  for (let y = 0; y < boardSize; y++) {
    let _cell = document.createElement("div");
    let _id = createID(x, y);
    _cell.classList.add("cell");
    _cell.setAttribute("id", `i${_id}`);
    _cell.setAttribute("title", _id);

    _cell.addEventListener("click", e => {
      if (!e.target.classList.contains("locked")) {
        e.target.classList.add("locked");
        let _piece = document.createElement("div");
        let _value = playerBlack ? "b" : "w";
        let _class = playerBlack ? "black" : "white";

        // if (playerBlack) piece.classList.add("black");
        // else piece.classList.add("white");
        _piece.classList.add(`${_class}`);
        _piece.classList.add(`${_id}`);
        _piece.classList.add("locked");
        board[x][y] = _value;

        playerBlack = !playerBlack;
        e.target.appendChild(_piece);
      }
    });

    // _cell.addEventListener("mouseenter", e => {
    //   let _temp = e.target.getAttribute("id");
    //   highlight(getRange(_temp));
    //   console.log(_temp);
    // });

    // board[x][y] = "";
    boardElement.appendChild(_cell);
  }
}
