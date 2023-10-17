"use strict";

const boardSize = 8;
let boardElement = document.querySelector(".board");
let playerBlack = true;

for (let x = 0; x < boardSize; x++) {
  for (let y = 0; y < boardSize; y++) {
    let tempCell = document.createElement("div");
    tempCell.classList.add("cell");

    tempCell.addEventListener("click", e => {
      if (!e.target.classList.contains("locked")) {
        e.target.classList.add("locked");
        let piece = document.createElement("div");
        if (playerBlack) piece.classList.add("black");
        else piece.classList.add("white");
        piece.classList.add("locked");
        playerBlack = !playerBlack;
        e.target.appendChild(piece);
      }
    });

    boardElement.appendChild(tempCell);
  }
}
