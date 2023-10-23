"use strict";

let board;
const boardSize = 16;
let boardElement = document.querySelector(".board");
let playerBlack = true;
let winner;
let gameEnded = false;
let btnAgain = document.querySelector("#again");
let modalOverlay = document.querySelector(".modal__overlay");
let modalContainer = document.querySelector(".container__modal");
let winnerTitle = document.querySelector(".modal__title");

const createBoard = function (_size) {
  let x = Array(_size).fill("");
  for (let i = 0; i < _size; i++) x[i] = Array(_size).fill("");
  return [...x];
};

const getRange = function (id) {
  let x = Number(id.slice(0, 2));
  let y = Number(id.slice(2));
  // console.log(x, y);
  let _minX = x - 4 > 0 ? x - 4 : 0;
  let _maxX = x + 4 < boardSize ? x + 4 : boardSize - 1;
  let _minY = y - 4 > 0 ? y - 4 : 0;
  let _maxY = y + 4 < boardSize ? y + 4 : boardSize - 1;

  // get arrays of chess to check, horizon, vertical, topdowncross, downtopcross
  let horizon = [];
  let vertical = [];
  let topdownCross = [];
  let downtopcross = [];

  // console.log("x ", _minX, _maxX);
  // console.log("y ", _minY, _maxY);

  //NOTE: horizon, same y, x from min to max
  for (let i = _minX; i <= _maxX; i++) {
    horizon.push(createID(i, y));
  }

  for (let i = _minY; i <= _maxY; i++) {
    vertical.push(createID(x, i));
  }

  let tempminus = [];
  let tempadd = [];
  let minus = 0;
  let add = 0;

  //NOTE: TOP DOWN CROSS
  minus = x - _minX < y - _minY ? x - _minX : y - _minY;
  for (let i = minus; i > 0; i--) tempminus.push(createID(x - i, y - i));
  add = _maxX - x < _maxY - y ? _maxX - x : _maxY - y;
  for (let i = 1; i <= add; i++) tempadd.push(createID(x + i, y + i));

  topdownCross = [...tempminus, createID(x, y), ...tempadd];

  ////NOTE: downto top, right - left
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

//NOTE:
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

//NOTE:
const createID = function (x, y) {
  let _x = x <= 9 ? "0" + x : String(x);
  let _y = y <= 9 ? "0" + y : String(y);
  return [_x, _y];
};

//NOTE:
const checkWin = function (id, chess) {
  let count = 0;
  let mark = [];

  //NOTE:Lay 1 mang gom cac hang can check - get arrays of horizon, vetical, cross from the chess
  let linesCheck = getRange(id);
  // let h = linesCheck[3];
  // kiem tra moi hang - check for each rows
  for (let row of linesCheck) {
    // neu so co lien nhau nho hon 5 -- if number of continues chess below 5
    if (count < 5) {
      for (let cell of row) {
        let x = Number(cell[0]);
        let y = Number(cell[1]);
        //if cell has value as check -- kiem tra trong board co giong voi quan can checkk khong
        //TODO: neu dung, count tang, them cell vao mang danh dau
        // if true, count++, add cell to mark array
        if (board[y][x] === chess) {
          count++;
          mark.push(cell);
          //if count = 5, win, break
          if (count === 5) {
            // NOTE: just hightlight mark to debug, maybe chage to show WinnerNOTE:
            let winner = chess === "b" ? "BLACK" : "WHITE";
            winnerTitle.textContent = `PLAYER ${winner} WIN`;
            gameEnded = true;

            for (let m of mark)
              document.querySelector(`#i${m[0]}${m[1]}`).classList.add("yel");
            modalOverlay.click();
            break;
          }
        } else {
          count = 0;
          mark = [];
        }
      }
    }
  }
};
function createBoardElement() {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      let _cell = document.createElement("div");
      let _id = createID(x, y);
      _cell.classList.add("cell");
      _cell.setAttribute("id", `i${_id[0]}${_id[1]}`);
      _cell.setAttribute("title", _id);

      _cell.addEventListener("click", e => {
        if (!gameEnded) {
          if (!e.target.classList.contains("locked")) {
            e.target.classList.add("locked");
            let _piece = document.createElement("div");
            let _value = playerBlack ? "b" : "w";
            let _class = playerBlack ? "black" : "white";

            //NOTE: ADD CHESS
            _piece.classList.add(`${_class}`);
            _piece.classList.add(`${_id}`);
            _piece.classList.add("locked");
            // _piece.classList.add("chess");

            board[y][x] = _value;
            // console.log(_id);
            checkWin(`${_id[0]}${_id[1]}`, _value);

            //NOTE: SWITCH PLAYER
            playerBlack = !playerBlack;

            e.target.appendChild(_piece);
            // highlight(`${createID(x, y)[0]}${createID(x, y)[1]}`);
          }
        }
      });

      boardElement.appendChild(_cell);
    }
  }
}

modalOverlay.addEventListener("click", e => {
  modalContainer.classList.toggle("hidden");
});

btnAgain.addEventListener("click", e => {
  reset();
  modalContainer.classList.toggle("hidden");
});

function reset() {
  board = createBoard(boardSize);
  playerBlack = true;
  gameEnded = false;
  // let cell = document.querySelectorAll(".cell");
  // for (let c of cell) c.remove();
  boardElement.innerHTML = "";
  createBoardElement();
}
reset();
