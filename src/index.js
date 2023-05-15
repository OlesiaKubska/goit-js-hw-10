import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce'; // Імпортуємо debounce з пакету lodash.debounce
import { fetchCountries } from './fetchCountries.js';

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

    // Якщо поле пошуку порожнє, очищаємо розмітку списку країн та інформації про країну
    if (searchValue === '') {
        clearMarkup();
        return;
    }
        // Виконуємо HTTP-запит до API країн з введеним значенням пошуку
    fetchCountries(searchValue)
        .then(countries => {
            // Обробка отриманих даних
            if (countries.length === 0) {
                Notify.failure('Oops, there is no country with that name');
                clearMarkup();
            } else if (countries.length === 1) {
                displayCountryInfo(country[0]); // Виклик функції для відображення даних про країну
            
            } else if (countries.length > 1 && countries.length <= 10) {
                renderCountryList(countries); // Виклик функції для відображення списку країн
            } else {
                Notify.info('Too many matches found. Please enter a more specific name.');
                clearMarkup();
            }
        })
            // Обробка помилки
        .catch(() => {
            Notify.failure('Oops, there is no country with that name');
            clearMarkup();
        });
}

//При отриманні результату викликається функція renderCountryList для відображення списку країн або повідомлення про помилку.
function renderCountryList(countries) {
    countriesList.innerHTML = ''; // Очищаємо розмітку списку країн
    
    countries.forEach(country => {
        const { flags: { svg }, name: { official } } = country; //Деструктурує властивості flags.svg та name.official з кожної країни.

        const listItem = document.createElement('li');//Створює новий елемент <li> для кожної країни.
        listItem.innerHTML = `<img src="${svg}" alt="${official} flag" /> ${official}`;

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
            <img src="${svg}" alt="${official} flag" width="40" height="auto" />
        </div>
        <div class="country-info__details">
            <h2>${official}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population.toLocaleString()}</p>
            <p><strong>Languages:</strong> ${languages.map(lang => lang.name).join(', ')}</p>
        </div>`;

    countryInfo.innerHTML = countryInfoMarkup; //Заміщує вміст елементу countryInfo отриманою розміткою, щоб відобразити інформацію про країну.
    
}  

// Функція, яка очищує розмітку списку країн або інформації про країну
function clearMarkup() {
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function clearCountryInfo() {
    countryInfo.innerHTML = ''; //функція очищає вміст елементу countryInfo, щоб забрати попередні дані про країну
}