import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce'; // Імпортуємо debounce з пакету lodash.debounce
import { fetchCountries } from './js/fetchCountries.js';
import { result } from 'lodash';

const DEBOUNCE_DELAY = 300; //Встановлює затримку DEBOUNCE_DELAY в 300 мс.

//Отримує посилання на елементи DOM, такі як список країн (countriesList)
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info'); //інформація про країну
const searchBox = document.querySelector('#search-box'); //поле пошуку (searchBox)

// Додаємо обробник події 'input' на поле пошуку з використанням debounce
searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

// Функція, яка виконується при події 'input'
function onSearch() {
    const searchValue = searchBox.value.trim(); //Отримується значення пошуку з поля введення та проводиться санітизація рядка методом trim()

    fetchCountries(searchValue)
        .then(countries => {
            if (countries.length > 10) {
                Notify.info('Too many matches found. Please, enter a more specific name.');
                return;
            }
            renderedCountries(countries);
        })
        .catch(error => {
            clearMarkup();
            Notify.failure('Oops, there is no country with that name');
        })
}

function renderedCountries(countries) {

    if (countries.length === 1) {
        clearMarkup();
        displayCountryInfo(countries);
    }

    if (countries.length > 1 && countries.length <= 10) {
        clearMarkup();
        displayCountryList(countries);
    }
}
    
function displayCountryList(countries) {
    countriesList.innerHTML = ''; // Очищаємо розмітку списку країн
    
    const countriesListMarkup = countries
        .map(country => {
            const { flags: { svg }, name: { official } } = country;
            return `<li class="country-item">
                        <img src="${country.flags.svg}" alt="${official} flag" width="40" height="auto" />
                        <p>${official}</p>
                    </li>`;
        })
        .join('');

    countriesList.innerHTML = countriesListMarkup;
    clearCountryInfo();
}

//функція displayCountryInfo(country) отримує об'єкт країни
function displayCountryInfo(country) {
    const countryInfoMarkup = country.map(({ flags, name, capital, population, languages }) => {
        languages = Object.values(languages).join(", ");
        return /*html*/ `
            <img src="${flags.svg}" alt="${name.official}" width="320" height="auto">
            <p>${name.official}</p>
            <p>Capital: <strong>${capital}</strong></p>
            <p>Population: <strong>${population}</strong></p>
            <p>Languages: <strong>${languages}</strong></p>`;
    }).join('');
    
    countryInfo.innerHTML = countryInfoMarkup;
    return countryInfoMarkup;
}  

// Функція, яка очищує розмітку списку країн або інформації про країну
function clearMarkup() {
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function clearCountryInfo() {
    countryInfo.innerHTML = ''; //функція очищає вміст елементу countryInfo, щоб забрати попередні дані про країну
}