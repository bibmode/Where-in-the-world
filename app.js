"use strict";

////////////////////////////////
// DROP DOWN TOGGLE

const downBtn = document.querySelector(".filter__icon--down");
const upBtn = document.querySelector(".filter__icon--up");
const filterLabel = document.querySelector(".filter__label");
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
filterLabel.addEventListener("click", toggleFilter);

////////////////////////////////
// API FOR MAIN SECTION
const cardContainer = document.querySelector(".card-container");

////////////////////////////////
// MAIN FUNCTIONS
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
  cardContainer.lastChild.addEventListener("click", function () {
    showInfoDiv(country);
  });
};

const removeCards = function () {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.parentNode.removeChild(card));
};

////////////////////////////////
// SHOW ALL
const showAllBtn = document.querySelector(".show-all__label");

const showAllCountries = function () {
  fetch(`https://restcountries.eu/rest/v2/all`)
    .then((response) => response.json())
    .then((data) =>
      data.forEach((country) => {
        addNewCard(country);
      })
    );
};

showAllCountries();

showAllBtn.addEventListener("click", function () {
  removeCards();
  showAllCountries();
});

////////////////////////////////
// FILTER
const filterOptions = document.querySelectorAll(".dropdown__item");

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
// API FOR INDIVIDUAL FACTS SECTION

const mainSection = document.querySelector(".main");

////////////////////////////////
// BACK BUTTON FUNCTIONALITY

const backAction = function () {
  const backBtn = document.querySelector(".info__button--label");

  backBtn.addEventListener("click", function () {
    const infoDiv = document.querySelector(".info");
    mainSection.style.display = "block";
    infoDiv.remove();
  });
};

////////////////////////////////
// SHOW DIV

const showInfoDiv = function (country) {
  const languages = [];
  country.languages.forEach((obj) => {
    languages.push(obj.name);
  });

  const html = `<div class="info">
      <div class="info__button">
        <button class="info__button--label">&larr; Back</button>
      </div>
      <div class="info__main">
        <div class="flag">
          <img class="flag__img" src="${country.flag}" alt="flag" />
        </div>
        <div class="facts">
          <h1 class="facts__name">${country.name}</h1>

          <div class="facts__list">
            <ul class="list">
              <li class="list__item"><span>Native Name:</span> ${
                country.name
              }</li>
              <li class="list__item"><span>Population:</span> ${country.population.toLocaleString()}</li>
              <li class="list__item"><span>Region:</span> ${country.region}</li>
              <li class="list__item"><span>Sub Region:</span> ${
                country.subregion
              }</li>
              <li class="list__item"><span>Capital:</span> ${
                country.capital
              }</li>
              <li class="list__item"><span>Top Level Domain:</span> ${
                country.topLevelDomain[0]
              }</li>
              <li class="list__item"><span>Currencies:</span> ${
                country.currencies[0].name
              }</li>
              <li class="list__item"><span>Languages:</span> ${languages.join(
                ", "
              )}</li>
            </ul>
          </div>

          <div class="facts__borders">
            <h3 class="facts__borders--label">Border Countries:</h3>
            <button class="facts__borders--btn">France</button>
          </div>
        </div>
      </div>
    </div>`;

  mainSection.style.display = "none";
  document.body.insertAdjacentHTML("beforeend", html);
  backAction();
};

////////////////////////////////
// GET INDIVIDUAL COUNTRY

const getCountry = function (country) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then((response) => response.json())
    .then(([data]) => {
      console.log(data);
      showInfoDiv(data);
    });
};

//getCountry("belgium");
