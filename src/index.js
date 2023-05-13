import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300; //Встановлює затримку DEBOUNCE_DELAY в 300 мс.

//Отримує посилання на елементи DOM, такі як список країн (countriesList)
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info'); //інформація про країну
const searchBox = document.querySelector('#search-box'); //поле пошуку (searchBox)

// Додаємо обробник події 'input' на поле пошуку
searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
    const searchValue = searchBox.value.trim(); //Отримується значення пошуку з поля введення та проводиться санітизація рядка методом trim()

    // Якщо поле пошуку порожнє, очищаємо розмітку списку країн та інформації про країну
    if (searchValue === '') {
        clearMarkup();
        return;
    }
//Виконується HTTP-запит до функції fetchCountries з передачею значення пошуку та властивостей країни для отримання даних. 
    fetchCountries(searchValue, 'name.official,capital,population,flags.svg,languages')
    
        .then(renderCountryList)
        .catch(error => Notify.failure(error));
}
//При отриманні результату викликається функція renderCountryList для відображення списку країн або повідомлення про помилку.
function renderCountryList(countries) {
    clearMarkup(); //Очищує розмітку списку країн.

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

// функція displayCountryList(countries) отримує список країн
function displayCountryList(countries) {
    //Використовуючи метод forEach, перебирає кожну країну у списку
    countries.forEach(country => {
        const { flags: { svg }, name: { official } } = country; //Деструктурує властивості flags.svg та name.official з кожної країни.

        const listItem = document.createElement('li');//Створює новий елемент <li> для кожної країни.
        listItem.innerHTML = `<img src="${svg}" alt="${official} flag" /> ${official}`;

//Додає обробник події click до кожного елементу <li>, що викликає функцію displayCountryInfo з об'єктом країни як аргумент.
        listItem.addEventListener('click', () => {
            displayCountryInfo(country);
        });

        countriesList.appendChild(listItem);//Додає елемент <li> до списку країн (countriesList).
    });

    clearCountryInfo();
}

//функція displayCountryInfo(country) отримує об'єкт країни
function displayCountryInfo(country) {
    clearCountryInfo(); //Викликає функцію clearCountryInfo для очищення попередньої інформації про країну.
    //Деструктурує: 
    const { flags: { svg }, name: { official }, capital, population, languages } = country;
//Створює розмітку для відображення інформації про країну, використовуючи отримані властивості.
    //Присвоює отриману розмітку змінній countryInfoMarkup.
    const countryInfoMarkup = `
        <div class="country-info__flag">
            <img src="${svg}" alt="${official} flag" width="40" height="20" />
        </div>
        <div class="country-info__details">
            <h2>${official}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population.toLocaleString()}</p>
            <p><strong>Languages:</strong> ${languages.map(lang => lang.name).join(', ')}</p>
        </div>`;

    countryInfo.innerHTML = countryInfoMarkup; //Заміщує вміст елементу countryInfo отриманою розміткою, щоб відобразити інформацію про країну.
    return countryInfoMarkup; //Повертає розмітку countryInfoMarkup для можливого використання в інших частинах коду.
}  

function clearMarkup() {
    clearCountryList();
    clearCountryInfo();
}

function clearCountryList() {
    countriesList.innerHTML = ''; //Функція clearCountryList присвоює порожній рядок властивості innerHTML елемента countriesList, що призводить до очищення списку країн.
}

function clearCountryInfo() {
    countryInfo.innerHTML = ''; //Функція clearCountryInfo присвоює порожній рядок властивості innerHTML елемента countryInfo, що призводить до очищення відображеної інформації про країну.
}