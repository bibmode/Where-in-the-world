"use strict";

////////////////////////////////
// THEME
const themeBtn = document.querySelector(".header__button");
let themeStatus = 1; //1 is for light, 0 is for black

themeBtn.addEventListener("click", function () {
  if (themeStatus === 1) {
    themeStatus = 0;
    document.body.setAttribute("data-theme", "dark");
  } else {
    themeStatus = 1;
    document.body.setAttribute("data-theme", "");
  }
});

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

  //hide when clicked outside of it
  document.addEventListener("mouseup", function (e) {
    if (
      e.target.classList.length === 0 ||
      (e.target.classList[0] !== "dropdown__item" &&
        e.target.classList[0] !== "filter__label" &&
        e.target.classList[0] !== "filter__icon" &&
        e.target.classList[0] !== "filter__icon--up" &&
        e.target.classList[0] !== "filter__icon--down")
    ) {
      dropdown.classList.add("hidden");
      downBtn.classList.remove("hidden");
      upBtn.classList.add("hidden");
    }
  });
};

downBtn.addEventListener("click", toggleFilter);
upBtn.addEventListener("click", toggleFilter);
filterLabel.addEventListener("click", toggleFilter);

////////////////////////////////
// API FOR MAIN SECTION
const cardContainer = document.querySelector(".card-container");
const mainSection = document.querySelector(".main");

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

  cardContainer.style.display = "flex";
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
// FILTER
const filterOptions = document.querySelectorAll(".dropdown__item");

const filterRegion = function (e) {
  cardContainer.style.display = "flex";
  filterOptions.forEach((option) => option.classList.remove("active-region"));
  e.target.classList.add("active-region");
  removeCards();
  checkError();

  const region = e.target.innerText;

  fetch(`https://restcountries.eu/rest/v2/region/${region}`)
    .then((response) => response.json())
    .then((data) => data.forEach((nation) => addNewCard(nation)));
};

filterOptions.forEach((option) => {
  option.addEventListener("click", filterRegion);
});

////////////////////////////////
// SHOW ALL
const showAllBtn = document.querySelector(".show-all__label");

const showAllCountries = function () {
  cardContainer.style.display = "flex";
  fetch(`https://restcountries.eu/rest/v2/all`)
    .then((response) => response.json())
    .then((data) =>
      data.forEach((country) => {
        addNewCard(country);
      })
    );

  filterOptions.forEach((option) => option.classList.remove("active-region"));
};

showAllCountries();

showAllBtn.addEventListener("click", function () {
  removeCards();
  showAllCountries();
  checkError();
});

////////////////////////////////
// RENDER ERROR

const renderError = function (msg) {
  //we check for the 14th element which is the error message
  checkError();

  const errorMsg = `<h2 class="error-msg">${msg}</h2>`;
  mainSection.insertAdjacentHTML("beforeend", errorMsg);
};

const checkError = function () {
  if (mainSection.childNodes.length > 13) {
    mainSection.removeChild(mainSection.lastChild);
  }
};

////////////////////////////////
// SEARCH COUNTRY
const searchInput = document.querySelector(".search__input");

const searchCountry = function (e) {
  if (e.key !== "Enter") return;

  if (!!e.target.value.trim()) {
    fetch(`https://restcountries.eu/rest/v2/name/${e.target.value}`)
      .then((response) => {
        //if response is false
        if (!response.ok) throw new Error(`Country not found 🚫😣`);

        return response.json();
      })
      .then(([data]) => {
        removeCards();
        addNewCard(data);
        checkError();
      })
      .catch((err) => {
        cardContainer.style.display = "none";
        renderError(`${err.message} Try again!`);
      });
  }
};

searchInput.addEventListener("keydown", searchCountry);

////////////////////////////////
// API FOR INDIVIDUAL FACTS SECTION

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
// ADD BORDER BUTTONS

const addBorders = function (countries) {
  const borderContainer = document.querySelector(".facts__borders");

  if (countries.length) {
    countries.forEach((country) => {
      fetch(`https://restcountries.eu/rest/v2/alpha/${country}`)
        .then((response) => response.json())
        .then((data) => {
          const borderHTML = `<button class="facts__borders--btn">${data.name}</button>`;
          borderContainer.insertAdjacentHTML("beforeend", borderHTML);
          changeDetails();
        });
    });
  } else {
    const notice = '<h3 class="facts__borders--notice">None</h3>';
    borderContainer.insertAdjacentHTML("beforeend", notice);
  }
};

const changeDetails = function (e) {
  const borderBtns = document.querySelectorAll(".facts__borders--btn");
  borderBtns.forEach((btn) => {
    btn.addEventListener("click", openBorder);
  });
};

const openBorder = function (e) {
  const nextNation = e.target.innerText;
  fetch(`https://restcountries.eu/rest/v2/name/${nextNation}`)
    .then((response) => response.json())
    .then(([data]) => {
      showInfoDiv(data);
      //showInfoDiv(data);
    });
  //showInfoDiv(nextNation);
};

////////////////////////////////
// SHOW DIV

const showInfoDiv = function (country) {
  const prevInfo = document.querySelector(".info");

  if (prevInfo !== null) document.body.removeChild(prevInfo);

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
              <li class="list__item"><span>Native Name: </span> ${
                country.name
              }</li>
              <li class="list__item"><span>Population: </span> ${country.population.toLocaleString()}</li>
              <li class="list__item"><span>Region: </span> ${
                country.region
              }</li>
              <li class="list__item"><span>Sub Region: </span> ${
                country.subregion
              }</li>
              <li class="list__item"><span>Capital: </span> ${
                country.capital
              }</li>
              <li class="list__item"><span>Top Level Domain: </span> ${
                country.topLevelDomain[0]
              }</li>
              <li class="list__item"><span>Currencies: </span> ${
                country.currencies[0].name
              }</li>
              <li class="list__item"><span>Languages: </span> ${languages.join(
                ", "
              )}</li>
            </ul>
          </div>

          <div class="facts__borders">
            <h3 class="facts__borders--label">Border Countries: </h3>
          </div>
        </div>
      </div>
    </div>`;

  mainSection.style.display = "none";
  document.body.insertAdjacentHTML("beforeend", html);
  addBorders(country.borders);
  changeDetails();
  backAction();
};
