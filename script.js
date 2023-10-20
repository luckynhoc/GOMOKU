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

  //get arrays of chess to check, horizon, vertical, topdowncross, downtopcross
  let horizon = [];
  let vertical = [];
  let topdownCross = [];
  let downtopcross = [];

  console.log("x ", _minX, _maxX);
  console.log("y ", _minY, _maxY);

  //horizon, same y, x from min to max
  for (let i = _minX; i <= _maxX; i++) {
    // let _x = i <= 9 ? `0${i}` : i.toString()
    // let _y = y <= 9 ? `0${y}` : y.toString();

    horizon.push(createID(i, y));
  }
  // return horizon;

  for (let i = _minY; i <= _maxY; i++) {
    vertical.push(createID(x, i));
  }
  // return vertical;

  ////topdown cross
  let tempminus = [];
  let tempadd = [];
  let minus = 0;
  let add = 0;
  //FIXME:
  if (x === y && x === 0) {
    tempminus = [];
  } else if (x <= y) {
    minus = x - _minX;
    for (let i = minus; i > 0; i--) tempminus.push(createID(x - i, y - i));
  } else {
    minus = y - _minY;
    for (let i = minus; i > 0; i--) tempminus.push(createID(x - i, y - i));
  }

  if (_maxX < _maxY) {
    add = _maxY - y;
    for (let i = 1; i <= add; i++) tempadd.push(createID(x + i, y + i));
  } else {
    add = _maxX - x;
    for (let i = 1; i <= add; i++) tempadd.push(createID(x + i, y + i));
  }
  // FIXME:
  topdownCross = [...tempminus, createID(x, y), ...tempadd];

  ////downto top, right - left
  tempminus = [];
  tempadd = [];
  minus = 0;
  add = 0;

  minus = _maxY - y < x - _minX ? _maxY - y : x - _minX;
  for (let i = minus; i > 0; i--) tempminus.push(createID(x - i, y + i));
  add = _maxX - x < y - _minY ? _maxX - x : y - _minY;
  for (let i = 1; i <= add; i++) tempadd.push(createID(x + i, y - i));

  downtopcross = [...tempminus, createID(x, y), ...tempadd];

  let linesCheck = [horizon, vertical, topdownCross, downtopcross];
  return linesCheck;
};

const highlight = function (id) {
  let arr = getRange(id);
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      let e = document.querySelector(`#i${arr[i][j][0]}${arr[i][j][1]}`);
      e.classList.add("yel");
      e.textContent = j;
    }
  }
};

const createID = function (x, y) {
  let _x = x <= 9 ? "0" + x : String(x);
  let _y = y <= 9 ? "0" + y : String(y);
  return [_x, _y];
};

for (let y = 0; y < boardSize; y++) {
  for (let x = 0; x < boardSize; x++) {
    let _cell = document.createElement("div");
    let _id = createID(x, y);
    _cell.classList.add("cell");
    _cell.setAttribute("id", `i${_id[0]}${_id[1]}`);
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
        board[y][x] = _value;

        playerBlack = !playerBlack;
        e.target.appendChild(_piece);
        highlight(`${createID(x, y)[0]}${createID(x, y)[1]}`);
      }
    });

    boardElement.appendChild(_cell);
  }
}
