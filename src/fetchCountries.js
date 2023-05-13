// fetchCountries.js

const URL = `https://restcountries.com/v3.1/name/`;
//створюємо URL для запиту до API країн за допомогою вказаного імені, 
//а також додаємо параметри пошуку, які включають потрібні властивості країни.

const searchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages,',
});


export const fetchCountries = (name) => {
    return fetch(`${URL}${name}?${searchParams.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        });
};