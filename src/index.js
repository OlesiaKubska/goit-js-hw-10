import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const searchBox = document.querySelector('#search-box');
const body = document.querySelector('body');

countriesList.style.visibility = 'hidden';
countryInfo.style.visibility = 'hidden';

// Додаємо обробник події 'input' на поле пошуку
searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
    const searchValue = searchBox.value.trim();

    // Якщо поле пошуку порожнє, очищаємо розмітку списку країн та інформації про країну
    if (searchValue === '') {
        clearMarkup();
        return;
    }

    fetchCountries(searchValue, 'name.official,capital,population,flags.svg,languages')
    
        .then(renderCountryList)
        .catch(error => Notify.failure(error));
}

function renderCountryList(countries) {
    clearMarkup();

    if (countries.length === 0) {
        // Якщо не знайдено країну, виводимо повідомлення про помилку
        Notify.failure('Oops, there is no country with that name');
    } else if (countries.length > 10) {
        // Якщо знайдено більше 10 країн, виводимо повідомлення про специфічнішу назву
        Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countries.length > 1 && countries.length <= 10) {
        // Якщо знайдено одну країну, виводимо розмітку з даними про країну
        displayCountryList(countries);
    }
}

function displayCountryList(countries) {
    countries.forEach(country => {
        const { flags: { svg }, name: { official } } = country;

        const listItem = document.createElement('li');
        listItem.innerHTML = `<img src="${svg}" alt="${official} flag" /> ${official}`;

        listItem.addEventListener('click', () => {
            displayCountryInfo(country);
        });

        countryList.appendChild(listItem);
    });

    clearCountryInfo();
}


function displayCountryInfo(country) {
    clearCountryInfo();
    
    const { flags: { svg }, name: { official }, capital, population, languages } = country;

    const countryInfoMarkup = `
        <div class="country-info__flag">
            <img src="${svg}" alt="${official} flag" />
        </div>
        <div class="country-info__details">
            <h2>${official}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population.toLocaleString()}</p>
            <p><strong>Languages:</strong> ${languages.map(lang => lang.name).join(', ')}</p>
        </div>
`;

countryInfo.innerHTML = countryInfoMarkup;
}  

function clearMarkup() {
    clearCountryList();
    clearCountryInfo();
}

function clearCountryList() {
    countryList.innerHTML = '';
}

function clearCountryInfo() {
    countryInfo.innerHTML = '';
}