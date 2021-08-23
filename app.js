"use strict";

////////////////////////////////
// DROP DOWN TOGGLE

const downBtn = document.querySelector(".filter__icon--down");
const upBtn = document.querySelector(".filter__icon--up");
const dropdown = document.querySelector(".dropdown");

const toggleFilter = function () {
  if (dropdown.classList.contains("hidden")) {
    dropdown.classList.remove("hidden");
    downBtn.classList.add("hidden");
    upBtn.classList.remove("hidden");
  } else {
    dropdown.classList.add("hidden");
    downBtn.classList.remove("hidden");
    upBtn.classList.add("hidden");
  }
};

downBtn.addEventListener("click", toggleFilter);
upBtn.addEventListener("click", toggleFilter);

////////////////////////////////
// API
