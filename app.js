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

const cardContainer = document.querySelector(".card-container");

// SHOW CARD
const addNewCard = function (country) {
  const html = `<a class="card" data-region="${country.region}">
          <img class="card__flag" src="${country.flag}" alt="flag" />
          <div class="card__info">
            <h2 class="card__info--name">${country.name}</h2>
            <h3 class="card__info--item">
              <span>Population: </span>${country.population.toLocaleString()}
            </h3>
            <h3 class="card__info--item"><span>Region: </span>${
              country.region
            }</h3>
            <h3 class="card__info--item"><span>Capital: </span>${
              country.capital
            }</h3>
          </div>
        </a>`;

  cardContainer.insertAdjacentHTML("beforeend", html);
};

fetch(`https://restcountries.eu/rest/v2/all`)
  .then((response) => response.json())
  .then((data) =>
    data.forEach((country) => {
      addNewCard(country);
    })
  );

////////////////////////////////
// FILTER
const filterOptions = document.querySelectorAll(".dropdown__item");

const removeCards = function () {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.parentNode.removeChild(card));
};

const filterRegion = function (e) {
  removeCards();

  const region = e.target.innerText;

  fetch(`https://restcountries.eu/rest/v2/region/${region}`)
    .then((response) => response.json())
    .then((data) => data.forEach((nation) => addNewCard(nation)));
};

filterOptions.forEach((option) => {
  option.addEventListener("click", filterRegion);
});

////////////////////////////////
// SEARCH COUNTRY
const searchInput = document.querySelector(".search__input");

const searchCountry = function (e) {
  if (e.key !== "Enter") return;

  console.log(e.target.value);
  fetch(`https://restcountries.eu/rest/v2/name/${e.target.value}`)
    .then((response) => response.json())
    .then(([data]) => {
      removeCards();
      addNewCard(data);
    });
};

searchInput.addEventListener("keydown", searchCountry);

////////////////////////////////
// TEST

const getCountry = function (country) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then((response) => response.json())
    .then(([data]) => {
      console.log(data);
    });
};

getCountry("philippines");
